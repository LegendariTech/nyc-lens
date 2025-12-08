/**
 * Owner Contact Data Types
 * Based on gold.owner_contact table schema
 */

export interface OwnerContact {
    borough: string | null;
    block: string | null;
    lot: string | null;
    owner_first_name: string | null;
    owner_last_name: string | null;
    owner_business_name: string | null;
    owner_type: string | null;
    owner_address: string | null;
    owner_city: string | null;
    owner_state: string | null;
    owner_zip: string | null;
    date: Date | null;
    agency: string | null;
    source: string | null;
    owner_title: string | null;
    owner_phone: string | null;
    owner_full_name: string | null;
    owner_middle_name: string | null;
    owner_address_2: string | null;
    owner_city_2: string | null;
    owner_state_2: string | null;
    owner_zip_2: string | null;
    owner_phone_2: string | null;
}
