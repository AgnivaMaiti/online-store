import { createClient } from '@supabase/supabase-js';

// Initialize the admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Make sure to add this to your environment variables
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reviewId } = req.body;

  if (!reviewId) {
    return res.status(400).json({ error: 'Review ID is required' });
  }

  try {
    const { error } = await supabaseAdmin
      .from('ratings')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to delete review',
      details: error.details || null
    });
  }
}
