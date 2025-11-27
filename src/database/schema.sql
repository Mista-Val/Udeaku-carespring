-- Udeaku CareSpring Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workshop Registrations Table
CREATE TABLE IF NOT EXISTS workshop_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    emergency_contact_name VARCHAR(200) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    medical_conditions TEXT,
    experience_level VARCHAR(50) DEFAULT 'beginner',
    preferred_training_date DATE,
    hear_about_us VARCHAR(200),
    additional_info TEXT,
    registration_status VARCHAR(50) DEFAULT 'pending' CHECK (registration_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    submission_type VARCHAR(50) DEFAULT 'general' CHECK (submission_type IN ('general', 'partnership', 'volunteer', 'media')),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    donor_name VARCHAR(200),
    donor_email VARCHAR(255),
    donor_phone VARCHAR(20),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    donation_type VARCHAR(50) DEFAULT 'one_time' CHECK (donation_type IN ('one_time', 'monthly')),
    payment_method VARCHAR(50) DEFAULT 'paystack',
    payment_reference VARCHAR(255) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'successful', 'failed', 'refunded')),
    purpose VARCHAR(200),
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Sessions Table
CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255) NOT NULL,
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers Table
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    skills TEXT,
    availability VARCHAR(100),
    volunteer_type VARCHAR(50) CHECK (volunteer_type IN ('trainer', 'assistant', 'logistics', 'admin', 'other')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_email ON workshop_registrations(email);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_status ON workshop_registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_created_at ON workshop_registrations(created_at);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON training_sessions(status);
CREATE INDEX IF NOT EXISTS idx_training_sessions_start_date ON training_sessions(start_date);

CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);

-- Enable Row Level Security (RLS)
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Workshop registrations - anyone can insert, only authenticated users can read
CREATE POLICY "Anyone can insert workshop registrations" ON workshop_registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view workshop registrations" ON workshop_registrations
    FOR SELECT USING (true);

-- Contact submissions - anyone can insert, only authenticated users can read
CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view contact submissions" ON contact_submissions
    FOR SELECT USING (true);

-- Donations - anyone can insert, only authenticated users can read
CREATE POLICY "Anyone can insert donations" ON donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view donations" ON donations
    FOR SELECT USING (true);

-- Training sessions - read-only for public, authenticated users can manage
CREATE POLICY "Anyone can view training sessions" ON training_sessions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage training sessions" ON training_sessions
    FOR ALL USING (auth.role() = 'authenticated');

-- Volunteers - read-only for public, authenticated users can manage
CREATE POLICY "Anyone can view volunteers" ON volunteers
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage volunteers" ON volunteers
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_workshop_registrations_updated_at BEFORE UPDATE ON workshop_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON training_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
