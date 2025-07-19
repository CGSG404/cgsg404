-- Seed casino data from existing static data
-- This migration populates the database with initial casino and news data

-- Insert casino categories
INSERT INTO public.casino_categories (name, description) VALUES
('Top Rated', 'Highest rated casinos with excellent user reviews'),
('New Casinos', 'Recently launched casinos'),
('Best Bonuses', 'Casinos with the most attractive bonus offers'),
('Hot Games', 'Casinos with trending and popular games'),
('Live Games', 'Casinos specializing in live dealer games'),
('Slot Games', 'Casinos with extensive slot game collections'),
('Sport Games', 'Casinos offering sports betting'),
('Crypto Payments', 'Casinos accepting cryptocurrency payments'),
('Local Payments', 'Casinos supporting local payment methods'),
('Mobile Optimized', 'Casinos with excellent mobile experience');

-- Insert casinos data
INSERT INTO public.casinos (name, slug, logo, rating, safety_index, bonus, description, play_url, is_new, is_hot, is_featured) VALUES
('Ducky Luck', 'ducky-luck', '/casino-logos/ducky luck.png', 4.0, 'Medium', 'Welcome Bonus Up To 400% + Daily Bonus 20%', 'Kickstart your gaming journey with a massive 400% Welcome Bonus and enjoy a 20% Daily Bonus to boost your winnings.', 'https://ducky7.com/RF12AA9985', true, false, false),
('Speed Sgd', 'speed-sgd', '/casino-logos/speedsgd-logos.png', 4.5, 'High', 'Welcome Bonus Up To 400% + Grand Daily Bonus 100%', 'Huge Your Chance with more Experience Play Large Welcome Bonus', 'https://speedsgd.com/RF29A8580A9', true, true, false),
('TOP1', 'top1', '/casino-logos/top1-logos.png', 4.8, 'Very High', '80% Welcome Bonus + Rescue Bonus', 'Play with Rescue, make your game last much longer & safe.', 'https://top1sg.com/RF295196839', true, true, true),
('BK88', 'bk88', '/casino-logos/bk88-logos.png', 4.8, 'Very High', '150% Welcome Bonus + Free Credit 365 Days', 'Enjoy a massive 150% Welcome Bonus plus Free Credit available 365 days a year.', 'https://bk888.co/BK88829A860350', true, true, true),
('Tokyo99', 'tokyo99', '/casino-logos/tokyo99-logos.png', 4.3, 'Medium', 'Welcome Bonus Up To 280% + Monthly Realbet', 'Unlock up to 280% Welcome Bonus + enjoy exclusive Realbet rewards every month.', 'https://www.sgtk99.com/RF12A5032A', true, false, false),
('Mega888', 'mega888', '/casino-logos/mega888-logos.png', 4.6, 'High', 'Welcome Bonus Up To 300% + Free Credit', 'Experience premium gaming with up to 300% Welcome Bonus and complimentary credits.', 'https://mega888.com/RF12A5032B', true, true, false),
('Kiss918', 'kiss918', '/casino-logos/kiss918-logos.png', 4.4, 'High', 'Welcome Bonus Up To 250% + Lucky Draw', 'Join the excitement with 250% Welcome Bonus and participate in exclusive lucky draws.', 'https://kiss918.com/RF12A5032C', true, false, false),
('Pussy888', 'pussy888', '/casino-logos/pussy888-logos.png', 4.7, 'Very High', 'Welcome Bonus Up To 350% + VIP Rewards', 'Unlock VIP treatment with 350% Welcome Bonus and exclusive VIP rewards program.', 'https://pussy888.com/RF12A5032D', true, true, true),
('Joker123', 'joker123', '/casino-logos/joker123-logos.png', 4.2, 'Medium', 'Welcome Bonus Up To 200% + Daily Cashback', 'Start your journey with 200% Welcome Bonus and enjoy daily cashback rewards.', 'https://joker123.com/RF12A5032E', true, false, false),
('Live22', 'live22', '/casino-logos/live22-logos.png', 4.5, 'High', 'Welcome Bonus Up To 300% + Tournament Entry', 'Get 300% Welcome Bonus and free entry to exclusive tournaments.', 'https://live22.com/RF12A5032F', true, true, false);

-- Insert casino features
INSERT INTO public.casino_features (casino_id, feature) VALUES
-- Ducky Luck features
(1, 'Live Service'),
(1, 'Local & CryptoPayments'),
(1, 'Mobile App'),
-- Speed Sgd features
(2, 'Mini Games'),
(2, 'Live Service'),
(2, 'Local Payments'),
-- TOP1 features
(3, 'Live Service'),
(3, 'Lucky Draw'),
(3, 'Local & Crypto Payments'),
-- BK88 features
(4, 'Live Service'),
(4, 'Lucky Draw'),
(4, 'Local Payments'),
-- Tokyo99 features
(5, 'Live Service'),
(5, 'Local Payments'),
-- Mega888 features
(6, 'Live Service'),
(6, 'Mobile App'),
(6, 'Local Payments'),
-- Kiss918 features
(7, 'Lucky Draw'),
(7, 'Mobile App'),
(7, 'Local Payments'),
-- Pussy888 features
(8, 'VIP Program'),
(8, 'Live Service'),
(8, 'Mobile App'),
-- Joker123 features
(9, 'Daily Cashback'),
(9, 'Mobile App'),
(9, 'Local Payments'),
-- Live22 features
(10, 'Tournament'),
(10, 'Live Service'),
(10, 'Mobile App');

-- Insert casino badges
INSERT INTO public.casino_badges (casino_id, badge) VALUES
-- Ducky Luck badges
(1, 'Slot Games'),
(1, 'Live Games'),
(1, 'Sport Games'),
(1, 'Other Games'),
(1, 'Not Licensed By CGSG'),
-- Speed Sgd badges
(2, 'Slot Games'),
(2, 'Live Games'),
(2, 'Sport Games'),
(2, 'Other Games'),
(2, 'Not Licensed By CGSG'),
-- TOP1 badges
(3, 'Top 5'),
(3, 'Hot Games'),
(3, 'Slot Games'),
(3, 'Live Games'),
(3, 'Sport Games'),
(3, 'Arcade Games'),
(3, 'Not Licensed By CGSG'),
-- BK88 badges
(4, 'Top 5'),
(4, 'Event Games'),
(4, 'Hot Games'),
(4, 'Slot Games'),
(4, 'Live Games'),
(4, 'Sport Games'),
(4, 'Other Games'),
(4, 'Not Licensed By CGSG'),
-- Tokyo99 badges
(5, 'Slot Games'),
(5, 'Live Games'),
(5, 'Sport Games'),
(5, 'Other Games'),
(5, 'Not Licensed By CGSG'),
-- Additional badges for other casinos
(6, 'Slot Games'),
(6, 'Live Games'),
(6, 'Mobile Optimized'),
(7, 'Slot Games'),
(7, 'Lucky Draw'),
(7, 'Mobile Optimized'),
(8, 'VIP Program'),
(8, 'Live Games'),
(8, 'Top Rated'),
(9, 'Slot Games'),
(9, 'Daily Rewards'),
(9, 'Mobile Optimized'),
(10, 'Tournament'),
(10, 'Live Games'),
(10, 'Mobile Optimized');

-- Insert casino links
INSERT INTO public.casino_links (casino_id, link_type, url) VALUES
-- Ducky Luck links
(1, 'bonus', '/bonuses/ducky-luck'),
(1, 'review', '/reviews/ducky-luck'),
(1, 'complaint', '/complaints/ducky-luck'),
-- Speed Sgd links
(2, 'bonus', '/bonuses/speed-sgd'),
(2, 'review', '/reviews/speed-sgd'),
(2, 'complaint', '/complaints/speed-sgd'),
-- TOP1 links
(3, 'bonus', '/bonuses/top1'),
(3, 'review', '/reviews/top1'),
(3, 'complaint', '/complaints/top1'),
-- BK88 links
(4, 'bonus', '/bonuses/bk88'),
(4, 'review', '/reviews/bk88'),
(4, 'complaint', '/complaints/bk88'),
-- Tokyo99 links
(5, 'bonus', '/bonuses/tokyo99'),
(5, 'review', '/reviews/tokyo99'),
(5, 'complaint', '/complaints/tokyo99'),
-- Additional links for other casinos
(6, 'bonus', '/bonuses/mega888'),
(6, 'review', '/reviews/mega888'),
(6, 'complaint', '/complaints/mega888'),
(7, 'bonus', '/bonuses/kiss918'),
(7, 'review', '/reviews/kiss918'),
(7, 'complaint', '/complaints/kiss918'),
(8, 'bonus', '/bonuses/pussy888'),
(8, 'review', '/reviews/pussy888'),
(8, 'complaint', '/complaints/pussy888'),
(9, 'bonus', '/bonuses/joker123'),
(9, 'review', '/reviews/joker123'),
(9, 'complaint', '/complaints/joker123'),
(10, 'bonus', '/bonuses/live22'),
(10, 'review', '/reviews/live22'),
(10, 'complaint', '/complaints/live22');

-- Insert news articles
INSERT INTO public.news_articles (title, slug, excerpt, content, author, category, image_url, read_time, is_published, published_at) VALUES
('CGSG Domain Officially Launched: Marking a New Era of Safer and More Trusted Online Gambling', 'cgsg-domain-officially-launched', 'Singapore July 2 2025 – CGSG (Casino Gaming Singapore Group) has officially launched its new domain marking a major milestone.', 'Singapore July 2 2025 – CGSG (Casino Gaming Singapore Group) has officially launched its new domain marking a major milestone in the online gambling industry. This launch represents our commitment to providing safer, more trusted, and transparent casino experiences for players in Singapore and beyond.

The new platform features enhanced security measures, comprehensive casino reviews, and real-time community feedback to help players make informed decisions. With our rigorous vetting process and safety ratings, CGSG aims to bridge the gap between players and trustworthy online casinos.

Key features of the new platform include:
- Comprehensive safety ratings for all listed casinos
- Real-time user reviews and ratings
- Advanced bonus tracking and verification
- Community-driven forum discussions
- Expert analysis and recommendations

This launch comes at a crucial time when the online gambling industry needs more transparency and player protection. CGSG is committed to setting new standards for casino guide platforms and ensuring that every player has access to safe and enjoyable gaming experiences.', 'Moderator CGSG', 'CGSG', '/news-banner/domain1.png', 'CGSG News', true, '2025-07-02 10:00:00+00'),
('The Future of Online Casino Gaming in Singapore', 'future-online-casino-gaming-singapore', 'Exploring the trends and innovations shaping the future of online casino gaming in Singapore.', 'The online casino industry in Singapore is experiencing unprecedented growth and innovation. As technology continues to evolve, we are seeing exciting developments that are reshaping how players interact with online casinos.

Virtual Reality (VR) and Augmented Reality (AR) are beginning to make their mark in the casino world, offering immersive experiences that bring the excitement of physical casinos to players'' homes. Live dealer games have become increasingly sophisticated, with multiple camera angles and interactive features that enhance the gaming experience.

Mobile gaming continues to dominate, with casinos optimizing their platforms for smartphones and tablets. The rise of cryptocurrency payments has also opened new possibilities for secure and anonymous transactions.

Looking ahead, we can expect to see:
- More VR and AR integration
- Advanced AI for personalized gaming experiences
- Improved mobile optimization
- Enhanced security measures
- More diverse payment options including cryptocurrencies

CGSG remains committed to tracking these developments and ensuring that our community stays informed about the latest trends and safest gaming options.', 'GURU x YS', 'Gaming', '/news-banner/coming-soon.png', 'CGSG News', true, '2025-07-02 14:00:00+00');

-- Assign categories to casinos
INSERT INTO public.casino_category_assignments (casino_id, category_id) VALUES
-- TOP1 and BK88 are top rated
(3, 1), (4, 1), (8, 1),
-- All are new casinos
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2), (6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
-- Best bonuses (300%+ bonuses)
(1, 3), (2, 3), (4, 3), (5, 3), (6, 3), (8, 3), (10, 3),
-- Hot games
(2, 4), (3, 4), (4, 4), (6, 4),
-- Live games
(1, 5), (2, 5), (3, 5), (4, 5), (5, 5), (6, 5), (8, 5), (10, 5),
-- Slot games
(1, 6), (2, 6), (3, 6), (4, 6), (5, 6), (6, 6), (7, 6), (8, 6), (9, 6), (10, 6),
-- Sport games
(1, 7), (2, 7), (3, 7), (4, 7), (5, 7),
-- Crypto payments
(1, 8), (3, 8),
-- Local payments
(1, 9), (2, 9), (3, 9), (4, 9), (5, 9), (6, 9), (7, 9), (9, 9),
-- Mobile optimized
(1, 10), (6, 10), (7, 10), (8, 10), (9, 10), (10, 10);
