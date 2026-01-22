# THT_Bengkrad

A beautiful web story with dynamic content management using Supabase backend.

## 🚀 Features

- Beautiful pastel-themed sections with smooth transitions
- Dynamic content loading from Supabase database
- Responsive design with smooth scrolling navigation
- Real-time content updates without redeploying

## 📋 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Go to Settings > API to get your project URL and anon key

### 2. Configure Database

1. In your Supabase dashboard, go to the SQL Editor
2. Run the following SQL to create the sections table:

```sql
-- Create sections table
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    section_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for GitHub Pages)
CREATE POLICY "Public read access" ON sections FOR SELECT USING (true);

-- Insert sample data
INSERT INTO sections (section_id, title, content, image_url) VALUES
('section1', 'Prolog', 'Welcome to our story. This is the beginning of an amazing journey filled with wonder and discovery.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),
('section2', 'Chapter 1', 'As our adventure begins, we encounter the first challenges and learn valuable lessons along the way.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'),
('section3', 'Chapter 2', 'The story deepens as new characters and plot twists emerge, keeping you on the edge of your seat.', 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800'),
('section4', 'Epilog', 'Our journey comes to a close, but the memories and lessons learned will stay with us forever.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');
```

### 3. Update Configuration

1. Open `config.js`
2. Replace `your-project-id` with your actual Supabase project ID
3. Replace `your-anon-key-here` with your actual anon key from Settings > API

### 4. Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to Repository Settings > Pages
3. Select the main branch as source
4. Your site will be available at `https://yourusername.github.io/repository-name`

## 🔧 Content Management

### Option 1: Admin Panel (Recommended)

1. Open `admin.html` in your browser
2. Enter the admin password (default: `admin123` - **change this in the code!**)
3. Edit content for each section directly in the web interface
4. Click "Save Changes" to update the database

### Option 2: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select the `sections` table
4. Edit content directly in the table:
   - `title`: Section heading
   - `content`: Main text content
   - `image_url`: URL to the image (use services like Unsplash, Imgur, or your own hosting)

### Option 2: SQL Updates

Use the SQL Editor to update content:

```sql
-- Update a section's content
UPDATE sections
SET title = 'New Title',
    content = 'New content here...',
    image_url = 'https://example.com/new-image.jpg',
    updated_at = NOW()
WHERE section_id = 'section1';
```

## 🎨 Customization

### Colors
The color scheme is defined in `script.js` in the `sectionColors` array. Each object represents HSL values:
- `h`: Hue (0-360)
- `s`: Saturation percentage
- `l`: Lightness percentage

### Sections
To add more sections:
1. Add HTML section in `index.html`
2. Add navigation link in the aside
3. Add corresponding entry in Supabase `sections` table
4. Add color to `sectionColors` array in `script.js`

## 🔒 Security Notes

- The database is configured with public read access for GitHub Pages compatibility
- Write operations are not exposed to the frontend for security
- All content updates must be done through the Supabase dashboard, SQL editor, or admin panel
- **Important:** Change the admin password in `admin.html` before deploying (search for `ADMIN_PASSWORD`)
- Consider using Supabase's built-in authentication for better security if needed

## 📱 Responsive Design

The site is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🛠 Development

To run locally:
1. Open `index.html` in your browser
2. The site will work without backend, showing placeholder content
3. Configure Supabase for dynamic content