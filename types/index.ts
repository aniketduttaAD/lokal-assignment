export interface JobPrimaryDetails {
    Place: string;
    Salary: string;
    Job_Type: string;
    Experience: string;
    Fees_Charged: string;
    Qualification: string;
}

export interface JobTag {
    value: string;
    bg_color: string;
    text_color: string;
}

export interface ContactPreference {
    preference: number;
    whatsapp_link: string;
    preferred_call_start_time: string;
    preferred_call_end_time: string;
}

export interface Creative {
    file: string;
    thumb_url: string;
    creative_type: number;
}

export interface ContentV3Item {
    field_key: string;
    field_name: string;
    field_value: string;
}

export interface ContentV3 {
    V3: ContentV3Item[];
}

export interface Job {
    id: number;
    title: string;
    type: number;
    primary_details: JobPrimaryDetails;
    job_tags: JobTag[];
    company_name: string;
    contact_preference: ContactPreference;
    is_bookmarked: boolean;
    creatives: Creative[];
    contentV3: ContentV3;
    button_text: string;
    custom_link: string;
    whatsapp_no: string;
    job_hours: string;
    job_role: string;
    other_details: string;
    job_category: string;
    salary_min: number;
    salary_max: number;
}

export interface JobsResponse {
    results: Job[];
}