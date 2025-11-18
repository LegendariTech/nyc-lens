export type AcrisRecord = {
  borough: string;
  block: string;
  lot: string;
  street_name: string;
  street_number: string;
  unit: string | null;
  lender_name: string;
  borrower_name: string;
  buyer_name: string;
  mortgage_document_id: string;
  mortgage_document_date: string;
  mortgage_recorded_date: string;
  mortgage_document_amount: number;
  sale_document_date: string;
  sale_recorded_date: string;
  sale_document_amount: number;
  avroll_building_class: string;
  avroll_building_story: number;
  avroll_units: number;
  id: string;
  address: string;
  address_with_unit: string;
  aka: string[];
  aka_address_street_name: string[];
  aka_address_street_number: string[];
  prior_mortgage_document_id: string;
  prior_mortgage_document_date: string;
  prior_mortgage_recorded_date: string;
  prior_mortgage_document_amount: number;
  prior_lender: string;
  prior_lendee: string;
  hpd_name: string | null;
  hpd_phone: string | null;
  purchase_refinance: string;
}


export type AcrisDoc = {
  borough: string;
  block: string;
  lot: string;
  document_date: string;
  recorded_date?: string;
  document_amount: number;
  document_type: string;
  doc_type_description: string;
  class_code_description: string;
  master_document_id?: string;
}

export type AcrisParty = {
  borough: string;
  block: string;
  lot: string;
  party_name: string;
  party_party_type: string;
  party_party_type_description: string;
  party_address_1?: string;
  party_address_2?: string;
  party_city?: string;
  party_state?: string;
  party_zip?: string;
  party_country?: string;
  party_record_type?: string;
}

