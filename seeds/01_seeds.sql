INSERT INTO users (name, email, password)
VALUES ('Petunia Ignatus', 'petty_p@yahoo.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Doyle McPoyle', 'mcpoyleisforever@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Chester McChesterton', 'forever_21_lolz@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jessica Rabbit', 'j.r1234@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (4, 'Hobbiton', 'description', 'thumbnail_photo_url', 'cover_photo-url', 29900, 2, 2, 2, 'New Zealand', '2 Hobbit lane', 'The Shire', 'Canturbury', 404928, true),
(1, 'Fir Forest', 'description', 'thumbnail_photo_url', 'cover_photo-url', 15700, 3, 2, 3, 'Canada', '257 Cedar drive', 'Weymouth', 'Nova Scotia', 23823, true),
(4, 'The Wharf', 'description', 'thumbnail_photo_url', 'cover_photo-url', 52500, 4, 2, 4, 'Canada', '52 Old Post road', 'Digby', 'Nova Scotia', 947577, true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2019-12-01', '2020-01-02', 1, 2),
('2020-06-15', '2020-06-21', 3, 1),
('2020-06-22', '2020-07-05', 3, 3),
('2020-09-09', '2020-09-24', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 5, 'messages'),
(2, 3, 4, 4, 'messages'),
(1, 3, 2, 5, 'messages');



