-- Seed reviews data
INSERT INTO public.reviews (id, reviewer_name, reviewer_instagram, thumbnail_url, instagram_reel_url, quote, rating, featured, active, display_order)
VALUES
  (
    'a1b2c3d4-e5f6-4789-a1b2-c3d4e5f6a7b8',
    'Priya Sharma',
    '@priyasharma',
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/reviews/priya.jpg',
    'https://www.instagram.com/reel/example1',
    'Absolutely authentic! The chilli oil is incredible, exactly like the street stalls in Lhasa. Best laphing I''ve had outside of Tibet!',
    5,
    true,
    true,
    1
  ),
  (
    'b2c3d4e5-f6a7-4890-b2c3-d4e5f6a7b8c9',
    'Rahul Mehta',
    '@rahulmehtaaa',
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/reviews/rahul.jpg',
    'https://www.instagram.com/reel/example2',
    'The kit is so well-packaged and the preparation guide is super easy to follow. Restaurant quality at home! My whole family loved it.',
    5,
    true,
    true,
    2
  ),
  (
    'c3d4e5f6-a7b8-4901-c3d4-e5f6a7b8c9d0',
    'Sonam Dolma',
    '@sonamdolma_',
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/reviews/sonam.jpg',
    'https://www.instagram.com/reel/example3',
    'Grew up eating laphing in Darjeeling and this is the closest I''ve found in Delhi. The authenticity is unmatched. Will order again!',
    5,
    true,
    true,
    3
  ),
  (
    'd4e5f6a7-b8c9-4012-d4e5-f6a7b8c9d0e1',
    'Arjun Singh',
    '@arjun.foodie',
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/reviews/arjun.jpg',
    'https://www.instagram.com/reel/example4',
    'Perfect spice level and the texture of the sheets is spot on. Fresh ingredients make all the difference!',
    5,
    true,
    true,
    4
  ),
  (
    'e5f6a7b8-c9d0-4123-e5f6-a7b8c9d0e1f2',
    'Neha Kapoor',
    '@nehakapoor',
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/reviews/neha.jpg',
    'https://www.instagram.com/reel/example5',
    'Love how quick and easy it is to prepare. The chilli oil has become my new obsession. Ordering again this weekend!',
    5,
    false,
    true,
    5
  ),
  (
    'f6a7b8c9-d0e1-4234-f6a7-b8c9d0e1f2a3',
    'Tenzin Norbu',
    '@tenzin.norbu',
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/reviews/tenzin.jpg',
    'https://www.instagram.com/reel/example6',
    'As a Tibetan, I can confirm this is authentic laphing. Takes me back home with every bite. Highly recommend!',
    5,
    false,
    true,
    6
  )
ON CONFLICT (id) DO UPDATE SET
  reviewer_name = EXCLUDED.reviewer_name,
  reviewer_instagram = EXCLUDED.reviewer_instagram,
  thumbnail_url = EXCLUDED.thumbnail_url,
  instagram_reel_url = EXCLUDED.instagram_reel_url,
  quote = EXCLUDED.quote,
  rating = EXCLUDED.rating,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();
