use stylus_sdk::{
    alloy_primitives::{Address, U256},
    call::Call,
    contract, evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageMap, StorageVec, StorageU256, StorageString, StorageBool},
    stylus_proc::{entrypoint, external, sol_storage},
};

#[derive(SolStorage)]
#[entrypoint]
pub struct DonationPool {
    admin: StorageAddress,
    shelters: StorageMap<Address, Shelter>,
    shelter_balances: StorageMap<Address, StorageU256>,
    shelter_list: StorageVec<StorageAddress>,
    total_donations: StorageU256,
}

#[derive(SolStorage)]
pub struct Shelter {
    name: StorageString,
    wallet: StorageAddress,
    total_received: StorageU256,
    active: StorageBool,
}

// Events
sol! {
    event DonationMade(address indexed donor, address indexed shelter, uint256 amount);
    event ShelterAdded(address indexed shelter, string name);
    event ShelterRemoved(address indexed shelter);
    event FundsWithdrawn(address indexed shelter, uint256 amount);
}

const FEE_PERCENTAGE: u64 = 250; // 2.5%
const PERCENTAGE_BASE: u64 = 10000;

#[external]
impl DonationPool {
    /// Initialize the contract
    pub fn init(&mut self) -> Result<(), Vec<u8>> {
        self.admin.set(msg::sender());
        Ok(())
    }

    /// Add a new shelter to the pool (only admin)
    pub fn add_shelter(&mut self, shelter_wallet: Address, name: String) -> Result<(), Vec<u8>> {
        if msg::sender() != self.admin.get() {
            return Err("Only admin can call this function".as_bytes().to_vec());
        }

        if shelter_wallet == Address::ZERO {
            return Err("Invalid shelter address".as_bytes().to_vec());
        }

        let mut shelter = self.shelters.setter(shelter_wallet);
        if shelter.active.get() {
            return Err("Shelter already exists".as_bytes().to_vec());
        }

        shelter.name.set_str(&name);
        shelter.wallet.set(shelter_wallet);
        shelter.total_received.set(U256::ZERO);
        shelter.active.set(true);

        self.shelter_list.push().set(shelter_wallet);

        evm::log(ShelterAdded {
            shelter: shelter_wallet,
            name,
        });

        Ok(())
    }

    /// Remove a shelter from the pool (only admin)
    pub fn remove_shelter(&mut self, shelter_wallet: Address) -> Result<(), Vec<u8>> {
        if msg::sender() != self.admin.get() {
            return Err("Only admin can call this function".as_bytes().to_vec());
        }

        let mut shelter = self.shelters.setter(shelter_wallet);
        if !shelter.active.get() {
            return Err("Shelter not found".as_bytes().to_vec());
        }

        shelter.active.set(false);

        // Remove from shelter list
        let len = self.shelter_list.len();
        for i in 0..len {
            if self.shelter_list.getter(i).get() == shelter_wallet {
                let last_index = len - 1;
                if i != last_index {
                    let last_element = self.shelter_list.getter(last_index).get();
                    self.shelter_list.setter(i).set(last_element);
                }
                self.shelter_list.pop();
                break;
            }
        }

        evm::log(ShelterRemoved {
            shelter: shelter_wallet,
        });

        Ok(())
    }

    /// Donate to a specific shelter
    #[payable]
    pub fn donate_to_shelter(&mut self, shelter_wallet: Address) -> Result<(), Vec<u8>> {
        let value = msg::value();
        if value == U256::ZERO {
            return Err("Donation amount must be greater than 0".as_bytes().to_vec());
        }

        let shelter = self.shelters.getter(shelter_wallet);
        if !shelter.active.get() {
            return Err("Shelter not active".as_bytes().to_vec());
        }

        let fee = value * U256::from(FEE_PERCENTAGE) / U256::from(PERCENTAGE_BASE);
        let donation_amount = value - fee;

        // Update balances
        let mut current_balance = self.shelter_balances.setter(shelter_wallet);
        let new_balance = current_balance.get() + donation_amount;
        current_balance.set(new_balance);

        // Update total received
        let mut shelter_mut = self.shelters.setter(shelter_wallet);
        let new_total = shelter_mut.total_received.get() + donation_amount;
        shelter_mut.total_received.set(new_total);

        // Update total donations
        let new_total_donations = self.total_donations.get() + value;
        self.total_donations.set(new_total_donations);

        evm::log(DonationMade {
            donor: msg::sender(),
            shelter: shelter_wallet,
            amount: donation_amount,
        });

        Ok(())
    }

    /// Donate to the pool and distribute equally
    #[payable]
    pub fn donate_to_pool(&mut self) -> Result<(), Vec<u8>> {
        let value = msg::value();
        if value == U256::ZERO {
            return Err("Donation amount must be greater than 0".as_bytes().to_vec());
        }

        let shelter_count = self.get_active_shelter_count();
        if shelter_count == 0 {
            return Err("No active shelters".as_bytes().to_vec());
        }

        let fee = value * U256::from(FEE_PERCENTAGE) / U256::from(PERCENTAGE_BASE);
        let total_donation = value - fee;
        let amount_per_shelter = total_donation / U256::from(shelter_count);

        let len = self.shelter_list.len();
        for i in 0..len {
            let shelter_address = self.shelter_list.getter(i).get();
            let shelter = self.shelters.getter(shelter_address);
            
            if shelter.active.get() {
                // Update balance
                let mut current_balance = self.shelter_balances.setter(shelter_address);
                let new_balance = current_balance.get() + amount_per_shelter;
                current_balance.set(new_balance);

                // Update total received
                let mut shelter_mut = self.shelters.setter(shelter_address);
                let new_total = shelter_mut.total_received.get() + amount_per_shelter;
                shelter_mut.total_received.set(new_total);

                evm::log(DonationMade {
                    donor: msg::sender(),
                    shelter: shelter_address,
                    amount: amount_per_shelter,
                });
            }
        }

        let new_total_donations = self.total_donations.get() + value;
        self.total_donations.set(new_total_donations);

        Ok(())
    }

    /// Withdraw funds (only shelter)
    pub fn withdraw_funds(&mut self) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        let shelter = self.shelters.getter(sender);
        
        if !shelter.active.get() {
            return Err("Only registered shelters can call this".as_bytes().to_vec());
        }

        let mut balance = self.shelter_balances.setter(sender);
        let amount = balance.get();
        
        if amount == U256::ZERO {
            return Err("No funds to withdraw".as_bytes().to_vec());
        }

        balance.set(U256::ZERO);

        // Transfer funds
        Call::new_in(self)
            .value(amount)
            .call(sender, &[])?;

        evm::log(FundsWithdrawn {
            shelter: sender,
            amount,
        });

        Ok(())
    }

    /// Get shelter information
    pub fn get_shelter_info(&self, shelter_wallet: Address) -> Result<(String, U256, U256, bool), Vec<u8>> {
        let shelter = self.shelters.getter(shelter_wallet);
        let balance = self.shelter_balances.getter(shelter_wallet).get();
        
        Ok((
            shelter.name.get_string(),
            balance,
            shelter.total_received.get(),
            shelter.active.get(),
        ))
    }

    /// Get all active shelters
    pub fn get_active_shelters(&self) -> Vec<Address> {
        let mut active_shelters = Vec::new();
        let len = self.shelter_list.len();
        
        for i in 0..len {
            let shelter_address = self.shelter_list.getter(i).get();
            let shelter = self.shelters.getter(shelter_address);
            
            if shelter.active.get() {
                active_shelters.push(shelter_address);
            }
        }
        
        active_shelters
    }

    /// Get pool statistics
    pub fn get_pool_stats(&self) -> (U256, u64, U256) {
        let total_donations = self.total_donations.get();
        let active_shelters = self.get_active_shelter_count();
        let contract_balance = self.get_balance();
        
        (total_donations, active_shelters, contract_balance)
    }

    /// Withdraw fees (only admin)
    pub fn withdraw_fees(&mut self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.admin.get() {
            return Err("Only admin can call this function".as_bytes().to_vec());
        }

        let balance = self.get_balance();
        if balance == U256::ZERO {
            return Err("No fees to withdraw".as_bytes().to_vec());
        }

        Call::new_in(self)
            .value(balance)
            .call(msg::sender(), &[])?;

        Ok(())
    }

    /// Get contract balance
    fn get_balance(&self) -> U256 {
        U256::from(self.balance())
    }

    /// Get active shelter count
    fn get_active_shelter_count(&self) -> u64 {
        let mut count = 0;
        let len = self.shelter_list.len();
        
        for i in 0..len {
            let shelter_address = self.shelter_list.getter(i).get();
            let shelter = self.shelters.getter(shelter_address);
            
            if shelter.active.get() {
                count += 1;
            }
        }
        
        count as u64
    }
}