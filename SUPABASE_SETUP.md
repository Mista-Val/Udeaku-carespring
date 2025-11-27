# Supabase Setup Guide for Udeaku CareSpring

## 🚀 Quick Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login to your account
3. Click "New Project"
4. Select your organization (or create one)
5. Choose a database password and region
6. Wait for the project to be created

### 2. Get Your Supabase Credentials
From your Supabase project dashboard:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

### 3. Set Up Environment Variables
Create a `.env` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Update your `.env` file with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Set Up Database Schema
1. Go to your Supabase project dashboard
2. Click on **SQL Editor**
3. Copy and paste the contents of `src/database/schema.sql`
4. Click **Run** to execute the schema

### 6. Test the Connection
```bash
# Start the development server
npm run dev

# Check the console for Supabase connection status
# You should see: "✅ Supabase connection successful"
```

## 📊 Database Tables Created

### Workshop Registrations
- Stores all first aid training registrations
- Fields: personal info, emergency contacts, medical conditions

### Contact Submissions
- Stores contact form submissions
- Fields: name, email, message, submission type

### Donations
- Tracks all donation records
- Fields: donor info, amount, payment status

### Training Sessions
- Manages training session schedules
- Fields: dates, location, participant limits

### Volunteers
- Volunteer management system
- Fields: skills, availability, contact info

## 🔧 API Endpoints Added

### Workshop Registration
- `POST /api/register` - Register for workshop
- `GET /api/registrations` - Get all registrations (admin)
- `PATCH /api/registrations/:id/status` - Update registration status

### Contact Forms
- `POST /api/contact` - Submit contact form
- `POST /api/send-partnership-email` - Send partnership inquiry

### Donations
- `GET /api/donations` - Get all donations (admin)
- `POST /api/donations` - Create donation record
- `PATCH /api/donations/:id/status` - Update donation status

## 🔒 Security Features

### Row Level Security (RLS)
- Enabled on all tables
- Public can insert data (forms, registrations)
- Authenticated users can read/manage data

### API Keys
- **Anon Key**: For client-side operations
- **Service Role Key**: For server-side admin operations

## 🧪 Testing the Integration

### Test Workshop Registration
```bash
curl -X POST http://localhost:5001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "08012345678",
    "address": "123 Test Street, Lagos",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "08087654321"
  }'
```

### Check Supabase Dashboard
1. Go to **Table Editor**
2. Select `workshop_registrations`
3. You should see the new registration

## 🔍 Troubleshooting

### Connection Issues
- Check your `.env` file has correct Supabase URL and keys
- Ensure your Supabase project is active
- Verify network connectivity

### Database Errors
- Check if schema was applied correctly
- Verify table names match exactly
- Check RLS policies if getting permission errors

### API Errors
- Check server logs for detailed error messages
- Verify request body format matches expected schema
- Ensure all required fields are included

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Security Considerations
- Never expose service role key in client-side code
- Use environment variables for all secrets
- Enable database backups in Supabase
- Monitor API usage and set limits

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Database Design Best Practices](https://supabase.com/docs/guides/database)

## 🆘 Support

If you encounter issues:
1. Check the server console logs
2. Verify Supabase project status
3. Review the schema.sql file
4. Test with the provided curl examples

---

**Ready to go!** Your backend is now connected to Supabase and ready to handle registrations, contacts, and donations with a proper database backend.
