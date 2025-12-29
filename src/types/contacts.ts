/**
 * Owner Contact Data Types from Elasticsearch
 * Based on owner_contacts_normalized_v_1_1 index mapping
 * Note: owner_business_name, owner_full_name, owner_phone, and owner_full_address are arrays in Elasticsearch
 */

export interface OwnerContact {
    bbl: string | null;
    borough: string | null;
    block: string | null;
    lot: string | null;
    bucket_name: string | null;
    date: Date | string | null;
    owner_business_name: string[] | null;
    owner_full_address: string[] | null;
    owner_full_name: string[] | null;
    owner_master_full_name: string | null;
    owner_phone: string[] | null;
    owner_title: string | null;
    status: string | null;
    merged_count: number | null;
    source: string[] | null;
    agency: string[] | null;
}
