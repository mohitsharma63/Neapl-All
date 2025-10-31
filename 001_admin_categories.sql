CREATE TABLE IF NOT EXISTS public.users
(
    id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    username text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    role text COLLATE pg_catalog."default" DEFAULT 'user'::text,
    account_type text COLLATE pg_catalog."default",
    is_active boolean DEFAULT true,
    avatar text COLLATE pg_catalog."default",
    country text COLLATE pg_catalog."default",
    state text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    area text COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default",
    postal_code text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
)
TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS ebooks_online_courses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL, -- 'ebook', 'online_course', 'both'
  category TEXT NOT NULL, -- 'academic', 'professional', 'skill_development', 'hobby', 'language', 'technology', 'business', 'health', 'creative'
  subcategory TEXT,
  
  -- E-Book Specific Fields
  book_title TEXT,
  author TEXT,
  publisher TEXT,
  isbn TEXT,
  publication_year INTEGER,
  edition TEXT,
  language TEXT,
  page_count INTEGER,
  file_format TEXT, -- 'pdf', 'epub', 'mobi', 'azw3', 'txt'
  file_size_mb NUMERIC(8,2),
  
  -- Course Specific Fields
  course_title TEXT,
  instructor_name TEXT,
  instructor_credentials TEXT,
  course_platform TEXT, -- 'udemy', 'coursera', 'custom', 'zoom', 'google_meet'
  course_duration_hours NUMERIC(6,2),
  total_lectures INTEGER,
  course_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'all_levels'
  course_language TEXT,
  subtitles_available JSONB DEFAULT '[]',
  
  -- Content Details
  topics_covered JSONB DEFAULT '[]',
  learning_outcomes JSONB DEFAULT '[]',
  prerequisites JSONB DEFAULT '[]',
  target_audience TEXT,
  content_type TEXT, -- 'video', 'text', 'mixed', 'interactive'
  
  -- Pricing
  price NUMERIC(12,2) NOT NULL,
  original_price NUMERIC(12,2),
  discount_percentage NUMERIC(5,2),
  is_free BOOLEAN DEFAULT false,
  lifetime_access BOOLEAN DEFAULT true,
  subscription_based BOOLEAN DEFAULT false,
  subscription_price_monthly NUMERIC(10,2),
  subscription_price_yearly NUMERIC(10,2),
  
  -- Course Features
  video_quality TEXT, -- '720p', '1080p', '4k'
  downloadable_resources BOOLEAN DEFAULT false,
  assignments_included BOOLEAN DEFAULT false,
  quizzes_included BOOLEAN DEFAULT false,
  certificate_provided BOOLEAN DEFAULT false,
  certificate_type TEXT, -- 'completion', 'verified', 'professional'
  live_sessions BOOLEAN DEFAULT false,
  recorded_sessions BOOLEAN DEFAULT true,
  one_on_one_support BOOLEAN DEFAULT false,
  group_discussions BOOLEAN DEFAULT false,
  
  -- Access & Delivery
  instant_access BOOLEAN DEFAULT true,
  access_duration_days INTEGER,
  download_allowed BOOLEAN DEFAULT true,
  download_limit INTEGER,
  streaming_allowed BOOLEAN DEFAULT true,
  offline_access BOOLEAN DEFAULT false,
  mobile_app_access BOOLEAN DEFAULT false,
  
  -- Reviews & Ratings
  total_students INTEGER DEFAULT 0,
  total_readers INTEGER DEFAULT 0,
  rating NUMERIC(3,2),
  review_count INTEGER DEFAULT 0,
  completion_rate NUMERIC(5,2),
  
  -- Additional Materials
  includes_ebook BOOLEAN DEFAULT false,
  includes_worksheets BOOLEAN DEFAULT false,
  includes_templates BOOLEAN DEFAULT false,
  includes_code_samples BOOLEAN DEFAULT false,
  bonus_content JSONB DEFAULT '[]',
  
  -- Media
  cover_image TEXT,
  preview_images JSONB DEFAULT '[]',
  preview_video_url TEXT,
  sample_chapters JSONB DEFAULT '[]',
  demo_lecture_url TEXT,
  
  -- Instructor/Author Info
  instructor_bio TEXT,
  instructor_rating NUMERIC(3,2),
  instructor_students_count INTEGER,
  instructor_courses_count INTEGER,
  author_bio TEXT,
  author_website TEXT,
  author_social_links JSONB DEFAULT '[]',
  
  -- Requirements & System
  system_requirements TEXT,
  software_needed JSONB DEFAULT '[]',
  hardware_requirements TEXT,
  internet_required BOOLEAN DEFAULT true,
  minimum_bandwidth TEXT,
  
  -- Updates & Support
  last_updated TIMESTAMP,
  content_updates BOOLEAN DEFAULT true,
  support_available BOOLEAN DEFAULT false,
  support_type TEXT, -- 'email', 'chat', 'forum', 'all'
  response_time TEXT,
  money_back_guarantee BOOLEAN DEFAULT false,
  guarantee_days INTEGER,
  
  -- Seller Information
  seller_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  seller_type TEXT, -- 'individual', 'institution', 'publisher', 'platform'
  institution_name TEXT,
  contact_person TEXT,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  alternate_phone TEXT,
  whatsapp_available BOOLEAN DEFAULT false,
  whatsapp_number TEXT,
  
  -- Location
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR ,
  
  -- Delivery & Payment
  delivery_method TEXT, -- 'instant_download', 'email', 'cloud_link', 'physical_copy'
  payment_methods JSONB DEFAULT '[]',
  installment_available BOOLEAN DEFAULT false,
  installment_plans JSONB DEFAULT '[]',
  refund_policy TEXT,
  refund_period_days INTEGER,
  
  -- SEO & Marketing
  keywords JSONB DEFAULT '[]',
  meta_description TEXT,
  promotional_video_url TEXT,
  testimonials JSONB DEFAULT '[]',
  
  -- Compliance & Legal
  copyright_notice TEXT,
  terms_of_use TEXT,
  privacy_policy TEXT,
  drm_protected BOOLEAN DEFAULT false,
  plagiarism_free BOOLEAN DEFAULT true,
  
  -- Status & Flags
  availability_status TEXT DEFAULT 'available',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_new_release BOOLEAN DEFAULT false,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ebooks_online_courses_listing_type ON ebooks_online_courses(listing_type);
CREATE INDEX IF NOT EXISTS idx_ebooks_online_courses_category ON ebooks_online_courses(category);
CREATE INDEX IF NOT EXISTS idx_ebooks_online_courses_city ON ebooks_online_courses(city);
CREATE INDEX IF NOT EXISTS idx_ebooks_online_courses_is_active ON ebooks_online_courses(is_active);
CREATE INDEX IF NOT EXISTS idx_ebooks_online_courses_is_featured ON ebooks_online_courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_ebooks_online_courses_seller_id ON ebooks_online_courses(seller_id);
CREATE TABLE IF NOT EXISTS cricket_sports_training (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK(listing_type IN ('individual', 'group', 'academy', 'coaching_camp')),
  training_category TEXT NOT NULL CHECK(training_category IN ('batting', 'bowling', 'wicket_keeping', 'fielding', 'all_rounder', 'fitness')),
  
  -- Training Details
  academy_name TEXT,
  coach_name TEXT NOT NULL,
  coach_experience_years INTEGER,
  coach_certifications TEXT,
  coach_achievements TEXT,
  
  -- Pricing
  price_per_session REAL,
  price_per_month REAL,
  price_per_quarter REAL,
  currency TEXT DEFAULT 'INR',
  discount_percentage REAL,
  
  -- Training Information
  training_level TEXT CHECK(training_level IN ('beginner', 'intermediate', 'advanced', 'professional', 'all_levels')),
  age_group TEXT,
  min_age INTEGER,
  max_age INTEGER,
  batch_size INTEGER,
  session_duration_minutes INTEGER,
  sessions_per_week INTEGER,
  
  -- Facilities & Equipment
  indoor_facility BOOLEAN DEFAULT FALSE,
  outdoor_facility BOOLEAN DEFAULT FALSE,
  net_practice_available BOOLEAN DEFAULT FALSE,
  pitch_available BOOLEAN DEFAULT FALSE,
  equipment_provided BOOLEAN DEFAULT FALSE,
  facilities TEXT, -- JSON array
  equipment_list TEXT, -- JSON array
  
  -- Training Programs
  training_modules TEXT, -- JSON array
  specializations TEXT, -- JSON array
  tournament_preparation BOOLEAN DEFAULT FALSE,
  match_practice BOOLEAN DEFAULT FALSE,
  video_analysis BOOLEAN DEFAULT FALSE,
  fitness_training BOOLEAN DEFAULT FALSE,
  mental_conditioning BOOLEAN DEFAULT FALSE,
  
  -- Schedule
  training_days TEXT, -- JSON array
  morning_batch BOOLEAN DEFAULT FALSE,
  evening_batch BOOLEAN DEFAULT FALSE,
  weekend_batch BOOLEAN DEFAULT FALSE,
  flexible_timing BOOLEAN DEFAULT FALSE,
  
  -- Certification & Success
  certificate_provided BOOLEAN DEFAULT FALSE,
  success_stories TEXT,
  students_trained INTEGER,
  professional_players_produced INTEGER,
  
  -- Trial & Registration
  free_trial_available BOOLEAN DEFAULT FALSE,
  trial_sessions INTEGER,
  registration_fee REAL,
  admission_process TEXT,
  
  -- Contact Information
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  alternate_phone TEXT,
  whatsapp_available BOOLEAN DEFAULT FALSE,
  whatsapp_number TEXT,
  website_url TEXT,
  
  -- Location
  city TEXT,
  state_province TEXT,
  area_name TEXT,
  full_address TEXT,
  country TEXT DEFAULT 'India',
  
  -- Media
  images TEXT, -- JSON array
  videos TEXT, -- JSON array
  brochure_url TEXT,
  
  -- Additional Info
  hostel_facility BOOLEAN DEFAULT FALSE,
  transport_facility BOOLEAN DEFAULT FALSE,
  diet_plan_included BOOLEAN DEFAULT FALSE,
  scholarship_available BOOLEAN DEFAULT FALSE,
  international_exposure BOOLEAN DEFAULT FALSE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_cricket_training_listing_type ON cricket_sports_training(listing_type);
CREATE INDEX IF NOT EXISTS idx_cricket_training_category ON cricket_sports_training(training_category);
CREATE INDEX IF NOT EXISTS idx_cricket_training_level ON cricket_sports_training(training_level);
CREATE INDEX IF NOT EXISTS idx_cricket_training_city ON cricket_sports_training(city);
CREATE INDEX IF NOT EXISTS idx_cricket_training_is_active ON cricket_sports_training(is_active);
CREATE INDEX IF NOT EXISTS idx_cricket_training_is_featured ON cricket_sports_training(is_featured);

CREATE TABLE IF NOT EXISTS schools_colleges_coaching_institutes (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL, -- 'school', 'college', 'coaching_institute', 'university', 'training_center'
  institution_category TEXT NOT NULL, -- 'primary_school', 'secondary_school', 'higher_secondary', 'engineering_college', 'medical_college', 'management_college', 'competitive_exams', 'skill_development', etc.
  institution_name TEXT NOT NULL,
  institution_type TEXT, -- 'government', 'private', 'aided', 'autonomous'
  affiliation TEXT, -- Board/University affiliation
  accreditation TEXT, -- NAAC, NBA, ISO, etc.
  establishment_year INTEGER,
  recognition_details TEXT,
  
  -- Academic Details
  courses_offered JSONB DEFAULT '[]',
  streams_available JSONB DEFAULT '[]',
  specializations JSONB DEFAULT '[]',
  medium_of_instruction JSONB DEFAULT '[]',
  board_affiliation TEXT, -- CBSE, ICSE, State Board, etc.
  university_affiliation TEXT,
  
  -- Admission Details
  admission_process TEXT,
  admission_criteria TEXT,
  entrance_exam_required BOOLEAN DEFAULT false,
  entrance_exam_name TEXT,
  minimum_percentage_required DECIMAL(5,2),
  age_criteria TEXT,
  eligibility_criteria TEXT,
  
  -- Fee Structure
  admission_fee DECIMAL(12,2),
  annual_tuition_fee DECIMAL(12,2),
  course_fee DECIMAL(12,2),
  registration_fee DECIMAL(12,2),
  examination_fee DECIMAL(12,2),
  development_fee DECIMAL(12,2),
  other_fees DECIMAL(12,2),
  total_fee_per_year DECIMAL(12,2),
  fee_payment_mode TEXT, -- 'yearly', 'semester', 'quarterly', 'monthly'
  scholarship_available BOOLEAN DEFAULT false,
  scholarship_details TEXT,
  fee_concession_available BOOLEAN DEFAULT false,
  installment_facility BOOLEAN DEFAULT false,
  
  -- Infrastructure
  total_area DECIMAL(10,2),
  area_unit TEXT DEFAULT 'acres',
  number_of_classrooms INTEGER,
  classroom_capacity INTEGER,
  laboratory_facilities JSONB DEFAULT '[]',
  library_available BOOLEAN DEFAULT false,
  library_books_count INTEGER,
  computer_lab BOOLEAN DEFAULT false,
  number_of_computers INTEGER,
  sports_facilities JSONB DEFAULT '[]',
  playground_available BOOLEAN DEFAULT false,
  auditorium_available BOOLEAN DEFAULT false,
  auditorium_capacity INTEGER,
  cafeteria_available BOOLEAN DEFAULT false,
  hostel_facility BOOLEAN DEFAULT false,
  hostel_capacity INTEGER,
  transport_facility BOOLEAN DEFAULT false,
  medical_facility BOOLEAN DEFAULT false,
  wi_fi_available BOOLEAN DEFAULT false,
  smart_classrooms BOOLEAN DEFAULT false,
  
  -- Faculty
  total_faculty INTEGER,
  phd_faculty INTEGER,
  postgraduate_faculty INTEGER,
  experienced_faculty INTEGER,
  student_teacher_ratio TEXT,
  faculty_qualifications TEXT,
  guest_faculty_available BOOLEAN DEFAULT false,
  
  -- Students
  total_students INTEGER,
  current_batch_strength INTEGER,
  batch_size INTEGER,
  student_capacity INTEGER,
  co_education BOOLEAN DEFAULT true,
  
  -- Results & Achievements
  pass_percentage DECIMAL(5,2),
  board_exam_results TEXT,
  university_exam_results TEXT,
  placement_percentage DECIMAL(5,2),
  average_package DECIMAL(12,2),
  highest_package DECIMAL(12,2),
  top_recruiters JSONB DEFAULT '[]',
  awards_achievements TEXT,
  notable_alumni TEXT,
  
  -- Coaching Specific
  coaching_subjects JSONB DEFAULT '[]',
  exam_preparation_for JSONB DEFAULT '[]', -- 'JEE', 'NEET', 'UPSC', 'Banking', etc.
  batch_timings TEXT,
  weekend_batches BOOLEAN DEFAULT false,
  online_classes_available BOOLEAN DEFAULT false,
  offline_classes_available BOOLEAN DEFAULT true,
  hybrid_mode BOOLEAN DEFAULT false,
  study_material_provided BOOLEAN DEFAULT false,
  mock_tests_provided BOOLEAN DEFAULT false,
  doubt_clearing_sessions BOOLEAN DEFAULT false,
  personal_mentoring BOOLEAN DEFAULT false,
  course_duration TEXT,
  
  -- Facilities & Amenities
  ac_classrooms BOOLEAN DEFAULT false,
  cctv_surveillance BOOLEAN DEFAULT false,
  security_guard BOOLEAN DEFAULT false,
  biometric_attendance BOOLEAN DEFAULT false,
  parent_teacher_meetings BOOLEAN DEFAULT false,
  extra_curricular_activities JSONB DEFAULT '[]',
  counseling_services BOOLEAN DEFAULT false,
  career_guidance BOOLEAN DEFAULT false,
  placement_assistance BOOLEAN DEFAULT false,
  internship_opportunities BOOLEAN DEFAULT false,
  
  -- Timing & Schedule
  working_hours TEXT,
  working_days TEXT,
  holiday_list TEXT,
  academic_calendar TEXT,
  
  -- Contact Information
  principal_name TEXT,
  director_name TEXT,
  head_of_institution TEXT,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  alternate_phone TEXT,
  whatsapp_available BOOLEAN DEFAULT false,
  whatsapp_number TEXT,
  website_url TEXT,
  
  -- Location
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT NOT NULL,
  landmark TEXT,
  pincode TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  
  -- Additional Details
  prospectus_url TEXT,
  brochure_url TEXT,
  virtual_tour_url TEXT,
  video_url TEXT,
  images JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  
  -- Policies
  admission_policy TEXT,
  refund_policy TEXT,
  cancellation_policy TEXT,
  terms_and_conditions TEXT,
  
  -- Status & Metadata
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  total_enrollments INTEGER DEFAULT 0,
  availability_status TEXT DEFAULT 'accepting_admissions',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  owner_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Educational Consultancy, Study Abroad & Admissions Table
CREATE TABLE IF NOT EXISTS educational_consultancy_study_abroad (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK(listing_type IN ('consultancy', 'admission_service', 'visa_assistance', 'complete_package')),
  
  -- Service Provider Details
  company_name TEXT NOT NULL,
  company_type TEXT CHECK(company_type IN ('consultancy', 'education_agent', 'visa_consultant', 'university_representative')),
  registration_number TEXT,
  license_number TEXT,
  established_year INTEGER,
  accreditation TEXT,
  affiliated_universities TEXT, -- JSON array
  partner_institutions TEXT, -- JSON array
  
  -- Services Offered
  services_offered TEXT, -- JSON array
  admission_assistance BOOLEAN DEFAULT TRUE,
  visa_assistance BOOLEAN DEFAULT TRUE,
  document_preparation BOOLEAN DEFAULT TRUE,
  application_processing BOOLEAN DEFAULT TRUE,
  scholarship_guidance BOOLEAN DEFAULT TRUE,
  loan_assistance BOOLEAN DEFAULT TRUE,
  pre_departure_orientation BOOLEAN DEFAULT TRUE,
  accommodation_assistance BOOLEAN DEFAULT TRUE,
  career_counseling BOOLEAN DEFAULT TRUE,
  language_training BOOLEAN DEFAULT FALSE,
  test_preparation BOOLEAN DEFAULT FALSE,
  interview_preparation BOOLEAN DEFAULT TRUE,
  
  -- Countries & Destinations
  countries_covered TEXT, -- JSON array
  popular_destinations TEXT, -- JSON array
  university_partnerships INTEGER,
  
  -- Study Programs
  programs_offered TEXT, -- JSON array
  undergraduate_programs BOOLEAN DEFAULT TRUE,
  postgraduate_programs BOOLEAN DEFAULT TRUE,
  doctoral_programs BOOLEAN DEFAULT FALSE,
  diploma_courses BOOLEAN DEFAULT TRUE,
  certificate_courses BOOLEAN DEFAULT TRUE,
  professional_courses BOOLEAN DEFAULT TRUE,
  foundation_programs BOOLEAN DEFAULT TRUE,
  pathway_programs BOOLEAN DEFAULT TRUE,
  
  -- Fields of Study
  engineering BOOLEAN DEFAULT FALSE,
  medicine BOOLEAN DEFAULT FALSE,
  business_management BOOLEAN DEFAULT FALSE,
  computer_science BOOLEAN DEFAULT FALSE,
  arts_humanities BOOLEAN DEFAULT FALSE,
  sciences BOOLEAN DEFAULT FALSE,
  law BOOLEAN DEFAULT FALSE,
  architecture BOOLEAN DEFAULT FALSE,
  design BOOLEAN DEFAULT FALSE,
  hospitality BOOLEAN DEFAULT FALSE,
  
  -- Pricing
  consultation_fee REAL,
  service_charge REAL,
  application_fee REAL,
  visa_processing_fee REAL,
  package_price REAL,
  currency TEXT DEFAULT 'INR',
  free_consultation BOOLEAN DEFAULT FALSE,
  refundable_deposit REAL,
  
  -- Success Metrics
  success_rate_percentage REAL,
  students_placed INTEGER,
  universities_tied_up INTEGER,
  countries_served INTEGER,
  years_of_experience INTEGER,
  visa_success_rate REAL,
  
  -- Eligibility & Requirements
  minimum_qualification TEXT,
  age_criteria TEXT,
  language_requirements TEXT,
  test_scores_required TEXT, -- JSON array (IELTS, TOEFL, GRE, GMAT, etc.)
  minimum_score_requirements TEXT,
  work_experience_required BOOLEAN DEFAULT FALSE,
  
  -- Timeline & Process
  processing_time TEXT,
  application_deadline_assistance BOOLEAN DEFAULT TRUE,
  intake_seasons TEXT, -- JSON array
  average_processing_days INTEGER,
  
  -- Support & Assistance
  counselor_name TEXT,
  counselor_qualification TEXT,
  counselor_experience_years INTEGER,
  dedicated_counselor BOOLEAN DEFAULT TRUE,
  group_counseling BOOLEAN DEFAULT FALSE,
  online_counseling BOOLEAN DEFAULT TRUE,
  in_person_counseling BOOLEAN DEFAULT TRUE,
  phone_support BOOLEAN DEFAULT TRUE,
  email_support BOOLEAN DEFAULT TRUE,
  whatsapp_support BOOLEAN DEFAULT TRUE,
  
  -- Additional Services
  mock_interviews BOOLEAN DEFAULT FALSE,
  sop_writing BOOLEAN DEFAULT TRUE,
  lor_assistance BOOLEAN DEFAULT TRUE,
  resume_building BOOLEAN DEFAULT TRUE,
  portfolio_development BOOLEAN DEFAULT FALSE,
  english_proficiency_training BOOLEAN DEFAULT FALSE,
  aptitude_test_coaching BOOLEAN DEFAULT FALSE,
  
  -- Documentation
  documents_required TEXT, -- JSON array
  document_verification BOOLEAN DEFAULT TRUE,
  document_translation BOOLEAN DEFAULT FALSE,
  attestation_services BOOLEAN DEFAULT FALSE,
  
  -- Financial Guidance
  scholarship_database_access BOOLEAN DEFAULT FALSE,
  education_loan_tie_ups TEXT, -- JSON array
  financial_planning BOOLEAN DEFAULT FALSE,
  part_time_job_guidance BOOLEAN DEFAULT FALSE,
  
  -- Post-Landing Services
  airport_pickup BOOLEAN DEFAULT FALSE,
  temporary_accommodation BOOLEAN DEFAULT FALSE,
  bank_account_opening_help BOOLEAN DEFAULT FALSE,
  sim_card_assistance BOOLEAN DEFAULT FALSE,
  university_orientation BOOLEAN DEFAULT FALSE,
  
  -- Contact Information
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  alternate_phone TEXT,
  whatsapp_number TEXT,
  website_url TEXT,
  social_media_links TEXT, -- JSON array
  
  -- Office Details
  branch_locations TEXT, -- JSON array
  head_office_address TEXT,
  consultation_mode TEXT, -- 'online', 'offline', 'both'
  appointment_required BOOLEAN DEFAULT TRUE,
  walk_in_allowed BOOLEAN DEFAULT FALSE,
  
  -- Location
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
  
  -- Working Hours
  working_hours TEXT,
  working_days TEXT,
  available_24_7 BOOLEAN DEFAULT FALSE,
  emergency_support BOOLEAN DEFAULT FALSE,
  
  -- Media & Testimonials
  images TEXT, -- JSON array
  videos TEXT, -- JSON array
  brochures TEXT, -- JSON array
  testimonials TEXT, -- JSON array
  case_studies TEXT, -- JSON array
  
  -- Certifications & Memberships
  certifications TEXT, -- JSON array
  professional_memberships TEXT, -- JSON array
  awards_recognition TEXT, -- JSON array
  
  -- Payment & Refund
  payment_methods TEXT, -- JSON array
  installment_available BOOLEAN DEFAULT FALSE,
  refund_policy TEXT,
  terms_and_conditions TEXT,
  cancellation_policy TEXT,
  
  -- Reviews & Rating
  rating REAL,
  review_count INTEGER DEFAULT 0,
  total_consultations INTEGER DEFAULT 0,
  
  -- Special Features
  free_seminar BOOLEAN DEFAULT FALSE,
  webinar_available BOOLEAN DEFAULT FALSE,
  study_material_provided BOOLEAN DEFAULT FALSE,
  mobile_app_available BOOLEAN DEFAULT FALSE,
  virtual_tour BOOLEAN DEFAULT FALSE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  
  -- Seller Information
  owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_listing_type ON educational_consultancy_study_abroad(listing_type);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_company_type ON educational_consultancy_study_abroad(company_type);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_city ON educational_consultancy_study_abroad(city);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_is_active ON educational_consultancy_study_abroad(is_active);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_is_featured ON educational_consultancy_study_abroad(is_featured);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_is_verified ON educational_consultancy_study_abroad(is_verified);

-- Educational Consultancy, Study Abroad & Admissions Table
CREATE TABLE IF NOT EXISTS educational_consultancy_study_abroad (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK(listing_type IN ('consultancy', 'admission_service', 'visa_assistance', 'complete_package')),
  
  -- Service Provider Details
  company_name TEXT NOT NULL,
  company_type TEXT CHECK(company_type IN ('consultancy', 'education_agent', 'visa_consultant', 'university_representative')),
  registration_number TEXT,
  license_number TEXT,
  established_year INTEGER,
  accreditation TEXT,
  affiliated_universities TEXT, -- JSON array
  partner_institutions TEXT, -- JSON array
  
  -- Services Offered
  services_offered TEXT, -- JSON array
  admission_assistance BOOLEAN DEFAULT TRUE,
  visa_assistance BOOLEAN DEFAULT TRUE,
  document_preparation BOOLEAN DEFAULT TRUE,
  application_processing BOOLEAN DEFAULT TRUE,
  scholarship_guidance BOOLEAN DEFAULT TRUE,
  loan_assistance BOOLEAN DEFAULT TRUE,
  pre_departure_orientation BOOLEAN DEFAULT TRUE,
  accommodation_assistance BOOLEAN DEFAULT TRUE,
  career_counseling BOOLEAN DEFAULT TRUE,
  language_training BOOLEAN DEFAULT FALSE,
  test_preparation BOOLEAN DEFAULT FALSE,
  interview_preparation BOOLEAN DEFAULT TRUE,
  
  -- Countries & Destinations
  countries_covered TEXT, -- JSON array
  popular_destinations TEXT, -- JSON array
  university_partnerships INTEGER,
  
  -- Study Programs
  programs_offered TEXT, -- JSON array
  undergraduate_programs BOOLEAN DEFAULT TRUE,
  postgraduate_programs BOOLEAN DEFAULT TRUE,
  doctoral_programs BOOLEAN DEFAULT FALSE,
  diploma_courses BOOLEAN DEFAULT TRUE,
  certificate_courses BOOLEAN DEFAULT TRUE,
  professional_courses BOOLEAN DEFAULT TRUE,
  foundation_programs BOOLEAN DEFAULT TRUE,
  pathway_programs BOOLEAN DEFAULT TRUE,
  
  -- Fields of Study
  engineering BOOLEAN DEFAULT FALSE,
  medicine BOOLEAN DEFAULT FALSE,
  business_management BOOLEAN DEFAULT FALSE,
  computer_science BOOLEAN DEFAULT FALSE,
  arts_humanities BOOLEAN DEFAULT FALSE,
  sciences BOOLEAN DEFAULT FALSE,
  law BOOLEAN DEFAULT FALSE,
  architecture BOOLEAN DEFAULT FALSE,
  design BOOLEAN DEFAULT FALSE,
  hospitality BOOLEAN DEFAULT FALSE,
  
  -- Pricing
  consultation_fee REAL,
  service_charge REAL,
  application_fee REAL,
  visa_processing_fee REAL,
  package_price REAL,
  currency TEXT DEFAULT 'INR',
  free_consultation BOOLEAN DEFAULT FALSE,
  refundable_deposit REAL,
  
  -- Success Metrics
  success_rate_percentage REAL,
  students_placed INTEGER,
  universities_tied_up INTEGER,
  countries_served INTEGER,
  years_of_experience INTEGER,
  visa_success_rate REAL,
  
  -- Eligibility & Requirements
  minimum_qualification TEXT,
  age_criteria TEXT,
  language_requirements TEXT,
  test_scores_required TEXT, -- JSON array (IELTS, TOEFL, GRE, GMAT, etc.)
  minimum_score_requirements TEXT,
  work_experience_required BOOLEAN DEFAULT FALSE,
  
  -- Timeline & Process
  processing_time TEXT,
  application_deadline_assistance BOOLEAN DEFAULT TRUE,
  intake_seasons TEXT, -- JSON array
  average_processing_days INTEGER,
  
  -- Support & Assistance
  counselor_name TEXT,
  counselor_qualification TEXT,
  counselor_experience_years INTEGER,
  dedicated_counselor BOOLEAN DEFAULT TRUE,
  group_counseling BOOLEAN DEFAULT FALSE,
  online_counseling BOOLEAN DEFAULT TRUE,
  in_person_counseling BOOLEAN DEFAULT TRUE,
  phone_support BOOLEAN DEFAULT TRUE,
  email_support BOOLEAN DEFAULT TRUE,
  whatsapp_support BOOLEAN DEFAULT TRUE,
  
  -- Additional Services
  mock_interviews BOOLEAN DEFAULT FALSE,
  sop_writing BOOLEAN DEFAULT TRUE,
  lor_assistance BOOLEAN DEFAULT TRUE,
  resume_building BOOLEAN DEFAULT TRUE,
  portfolio_development BOOLEAN DEFAULT FALSE,
  english_proficiency_training BOOLEAN DEFAULT FALSE,
  aptitude_test_coaching BOOLEAN DEFAULT FALSE,
  
  -- Documentation
  documents_required TEXT, -- JSON array
  document_verification BOOLEAN DEFAULT TRUE,
  document_translation BOOLEAN DEFAULT FALSE,
  attestation_services BOOLEAN DEFAULT FALSE,
  
  -- Financial Guidance
  scholarship_database_access BOOLEAN DEFAULT FALSE,
  education_loan_tie_ups TEXT, -- JSON array
  financial_planning BOOLEAN DEFAULT FALSE,
  part_time_job_guidance BOOLEAN DEFAULT FALSE,
  
  -- Post-Landing Services
  airport_pickup BOOLEAN DEFAULT FALSE,
  temporary_accommodation BOOLEAN DEFAULT FALSE,
  bank_account_opening_help BOOLEAN DEFAULT FALSE,
  sim_card_assistance BOOLEAN DEFAULT FALSE,
  university_orientation BOOLEAN DEFAULT FALSE,
  
  -- Contact Information
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  alternate_phone TEXT,
  whatsapp_number TEXT,
  website_url TEXT,
  social_media_links TEXT, -- JSON array
  
  -- Office Details
  branch_locations TEXT, -- JSON array
  head_office_address TEXT,
  consultation_mode TEXT, -- 'online', 'offline', 'both'
  appointment_required BOOLEAN DEFAULT TRUE,
  walk_in_allowed BOOLEAN DEFAULT FALSE,
  
  -- Location
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id TEXT,
  
  -- Working Hours
  working_hours TEXT,
  working_days TEXT,
  available_24_7 BOOLEAN DEFAULT FALSE,
  emergency_support BOOLEAN DEFAULT FALSE,
  
  -- Media & Testimonials
  images TEXT, -- JSON array
  videos TEXT, -- JSON array
  brochures TEXT, -- JSON array
  testimonials TEXT, -- JSON array
  case_studies TEXT, -- JSON array
  
  -- Certifications & Memberships
  certifications TEXT, -- JSON array
  professional_memberships TEXT, -- JSON array
  awards_recognition TEXT, -- JSON array
  
  -- Payment & Refund
  payment_methods TEXT, -- JSON array
  installment_available BOOLEAN DEFAULT FALSE,
  refund_policy TEXT,
  terms_and_conditions TEXT,
  cancellation_policy TEXT,
  
  -- Reviews & Rating
  rating REAL,
  review_count INTEGER DEFAULT 0,
  total_consultations INTEGER DEFAULT 0,
  
  -- Special Features
  free_seminar BOOLEAN DEFAULT FALSE,
  webinar_available BOOLEAN DEFAULT FALSE,
  study_material_provided BOOLEAN DEFAULT FALSE,
  mobile_app_available BOOLEAN DEFAULT FALSE,
  virtual_tour BOOLEAN DEFAULT FALSE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  
  -- Seller Information
  owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_listing_type ON educational_consultancy_study_abroad(listing_type);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_company_type ON educational_consultancy_study_abroad(company_type);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_city ON educational_consultancy_study_abroad(city);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_is_active ON educational_consultancy_study_abroad(is_active);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_is_featured ON educational_consultancy_study_abroad(is_featured);
CREATE INDEX IF NOT EXISTS idx_edu_consultancy_is_verified ON educational_consultancy_study_abroad(is_verified);

CREATE TABLE IF NOT EXISTS public.user_documents
(
    id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    document_name text COLLATE pg_catalog."default" NOT NULL,
    document_url text COLLATE pg_catalog."default" NOT NULL,
    document_type text COLLATE pg_catalog."default",
    file_size integer,
    uploaded_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_documents_pkey PRIMARY KEY (id),
    CONSTRAINT user_documents_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_documents
    OWNER to postgres;
-- Index: idx_user_documents_user

-- DROP INDEX IF EXISTS public.idx_user_documents_user;

CREATE INDEX IF NOT EXISTS idx_user_documents_user
    ON public.user_documents USING btree
    (user_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;



CREATE TABLE IF NOT EXISTS public.user_category_preferences
(
    id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    category_slug text COLLATE pg_catalog."default" NOT NULL,
    subcategory_slugs jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_category_preferences_pkey PRIMARY KEY (id),
    CONSTRAINT user_category_preferences_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_category_preferences
    OWNER to postgres;


CREATE INDEX IF NOT EXISTS idx_user_category_preferences_user
    ON public.user_category_preferences USING btree
    (user_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


CREATE TABLE admin_categories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#1e40af',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subcategories table with parent relationship
CREATE TABLE admin_subcategories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  parent_category_id VARCHAR NOT NULL REFERENCES admin_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS hostel_listings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_per_month NUMERIC(10,2) NOT NULL CHECK (price_per_month >= 0),
  hostel_type TEXT NOT NULL,
  room_type TEXT NOT NULL,
  total_beds INTEGER NOT NULL CHECK (total_beds >= 0),
  available_beds INTEGER NOT NULL CHECK (available_beds >= 0 AND available_beds <= total_beds),
  country TEXT NOT NULL,
  state_province TEXT,
  city TEXT NOT NULL,
  area TEXT,
  full_address TEXT NOT NULL,
  contact_person TEXT,
  contact_phone TEXT,
  rules TEXT,
  facilities JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  food_included BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  owner_id VARCHAR,  -- ✅ match users.id type
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Fix: Add missing referenced table for location_id (example assumes 'locations' table with 'id')
-- You can change 'locations(id)' to your actual table name and column.

CREATE TABLE IF NOT EXISTS construction_materials (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  unit TEXT NOT NULL,
  brand TEXT,
  specifications JSONB,
  images JSONB DEFAULT '[]',
  supplier_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  supplier_name TEXT,
  supplier_contact TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  stock_status TEXT DEFAULT 'in_stock',
  minimum_order INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ✅ Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_construction_materials_category ON construction_materials(category);
CREATE INDEX IF NOT EXISTS idx_construction_materials_city ON construction_materials(city);
CREATE INDEX IF NOT EXISTS idx_construction_materials_is_active ON construction_materials(is_active);
CREATE INDEX IF NOT EXISTS idx_construction_materials_is_featured ON construction_materials(is_featured);
CREATE INDEX IF NOT EXISTS idx_construction_materials_stock_status ON construction_materials(stock_status);
CREATE INDEX IF NOT EXISTS idx_construction_materials_created_at ON construction_materials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_construction_materials_location_id ON construction_materials(location_id);

-- ✅ Create or replace trigger function
CREATE OR REPLACE FUNCTION update_construction_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ✅ Drop trigger if exists (no problem if it doesn’t exist)
DROP TRIGGER IF EXISTS trigger_update_construction_materials_updated_at ON construction_materials;

-- ✅ Create trigger
CREATE TRIGGER trigger_update_construction_materials_updated_at
BEFORE UPDATE ON construction_materials
FOR EACH ROW
EXECUTE FUNCTION update_construction_materials_updated_at();
-- ==========================================================
-- Table: property_deals
-- Description: Stores property listings for Buy/Sell deals
-- ==========================================================

CREATE TABLE IF NOT EXISTS property_deals (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  deal_type TEXT NOT NULL CHECK (deal_type IN ('buy', 'sell')),
  property_type TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  area NUMERIC(10,2),
  area_unit TEXT DEFAULT 'sq.ft',
  bedrooms INTEGER,
  bathrooms INTEGER,
  floors INTEGER,
  road_access TEXT,
  facing_direction TEXT,
  images JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  is_negotiable BOOLEAN DEFAULT false,
  ownership_type TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR,
  agency_id VARCHAR,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes (for performance optimization)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_property_deals_deal_type ON property_deals(deal_type);
CREATE INDEX IF NOT EXISTS idx_property_deals_property_type ON property_deals(property_type);
CREATE INDEX IF NOT EXISTS idx_property_deals_city ON property_deals(city);
CREATE INDEX IF NOT EXISTS idx_property_deals_is_active ON property_deals(is_active);
CREATE INDEX IF NOT EXISTS idx_property_deals_is_featured ON property_deals(is_featured);
CREATE INDEX IF NOT EXISTS idx_property_deals_created_at ON property_deals(created_at DESC);

-- ==========================================================
-- Trigger function to auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_property_deals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_property_deals_updated_at
BEFORE UPDATE ON property_deals
FOR EACH ROW
EXECUTE FUNCTION update_property_deals_updated_at();
-- ==========================================================
-- Table: industrial_properties
-- Description: Stores listings for factories, warehouses,
-- industrial land, and related properties
-- ==========================================================

CREATE TABLE IF NOT EXISTS industrial_properties (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  industrial_type TEXT NOT NULL CHECK (industrial_type IN ('factory', 'warehouse', 'industrial land', 'logistics hub', 'manufacturing unit')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('rent', 'sale', 'lease')),
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  price_type TEXT CHECK (price_type IN ('monthly', 'yearly', 'total')),
  land_area NUMERIC(12,2),
  built_up_area NUMERIC(12,2),
  area_unit TEXT DEFAULT 'sq.ft',
  floors INTEGER,
  power_supply TEXT, -- e.g., "24/7", "3-phase"
  water_facility BOOLEAN DEFAULT FALSE,
  road_access TEXT,
  loading_docks INTEGER,
  parking_spaces INTEGER,
  crane_facility BOOLEAN DEFAULT FALSE,
  images JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  suitable_for JSONB DEFAULT '[]',
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  agency_id VARCHAR REFERENCES agencies(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes (for performance)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_industrial_properties_industrial_type ON industrial_properties(industrial_type);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_listing_type ON industrial_properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_city ON industrial_properties(city);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_is_active ON industrial_properties(is_active);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_is_featured ON industrial_properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_created_at ON industrial_properties(created_at DESC);

-- ==========================================================
-- Trigger Function: Auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_industrial_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: Automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_industrial_properties_updated_at
BEFORE UPDATE ON industrial_properties
FOR EACH ROW
EXECUTE FUNCTION update_industrial_properties_updated_at();
-- ==========================================================
-- Table: office_spaces
-- Description: Stores listings for office spaces (private, shared, coworking, virtual)
-- ==========================================================

CREATE TABLE IF NOT EXISTS office_spaces (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('rent', 'sale', 'lease')),
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  price_type TEXT DEFAULT 'monthly' CHECK (price_type IN ('monthly','yearly','total')),
  area NUMERIC(10,2),
  office_type TEXT CHECK (office_type IN ('private', 'shared', 'coworking', 'virtual')),
  capacity INTEGER,
  cabins INTEGER,
  workstations INTEGER,
  meeting_rooms INTEGER,
  furnishing_status TEXT,
  images JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  parking_spaces INTEGER,
  floor INTEGER,
  total_floors INTEGER,
  available_from TIMESTAMPTZ,
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  agency_id VARCHAR REFERENCES agencies(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_office_spaces_listing_type ON office_spaces(listing_type);
CREATE INDEX IF NOT EXISTS idx_office_spaces_office_type ON office_spaces(office_type);
CREATE INDEX IF NOT EXISTS idx_office_spaces_city ON office_spaces(city);
CREATE INDEX IF NOT EXISTS idx_office_spaces_is_active ON office_spaces(is_active);
CREATE INDEX IF NOT EXISTS idx_office_spaces_is_featured ON office_spaces(is_featured);
CREATE INDEX IF NOT EXISTS idx_office_spaces_created_at ON office_spaces(created_at DESC);

-- ==========================================================
-- Trigger Function: Auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_office_spaces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: Automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_office_spaces_updated_at
BEFORE UPDATE ON office_spaces
FOR EACH ROW
EXECUTE FUNCTION update_office_spaces_updated_at();
-- ==========================================================
-- Table: rental_listings
-- Description: Stores rental listings for rooms, flats, apartments, houses
-- ==========================================================

CREATE TABLE IF NOT EXISTS rental_listings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  rental_type TEXT NOT NULL CHECK (rental_type IN ('room', 'flat', 'apartment', 'house')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area NUMERIC(8,2),
  furnishing_status TEXT,
  images JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  available_from TIMESTAMPTZ,
  deposit_amount NUMERIC(10,2),
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  agency_id VARCHAR REFERENCES agencies(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_rental_listings_rental_type ON rental_listings(rental_type);
CREATE INDEX IF NOT EXISTS idx_rental_listings_city ON rental_listings(city);
CREATE INDEX IF NOT EXISTS idx_rental_listings_is_active ON rental_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_rental_listings_is_featured ON rental_listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_rental_listings_created_at ON rental_listings(created_at DESC);

-- ==========================================================
-- Trigger Function: Auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_rental_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: Automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_rental_listings_updated_at
BEFORE UPDATE ON rental_listings
FOR EACH ROW
EXECUTE FUNCTION update_rental_listings_updated_at();



CREATE TABLE IF NOT EXISTS heavy_equipment (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'lease')),
  equipment_type TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  price_type TEXT DEFAULT 'total' CHECK (price_type IN ('hourly', 'daily', 'monthly', 'total')),
  condition TEXT CHECK (condition IN ('new', 'used', 'refurbished')),
  hours_used INTEGER,
  serial_number TEXT,
  specifications JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  maintenance_history TEXT,
  warranty_info TEXT,
  is_negotiable BOOLEAN DEFAULT false,
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  seller_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_listing_type ON heavy_equipment(listing_type);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_equipment_type ON heavy_equipment(equipment_type);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_category ON heavy_equipment(category);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_city ON heavy_equipment(city);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_is_active ON heavy_equipment(is_active);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_is_featured ON heavy_equipment(is_featured);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_created_at ON heavy_equipment(created_at DESC);

-- ==========================================================
-- Trigger Function: Auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_heavy_equipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: Automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_heavy_equipment_updated_at
BEFORE UPDATE ON heavy_equipment
FOR EACH ROW
EXECUTE FUNCTION update_heavy_equipment_updated_at();