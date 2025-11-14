-- CREATE --> Add new book
INSERT INTO BOOK (book_id, title, author, publication_year, genre) 
VALUES ('ISBN004', 'New Book Title', 'New Author', 2024, 'Fiction');

-- READ --> Search book by title
SELECT * FROM BOOK WHERE title LIKE '%Database%';

-- READ --> Get all active loans
SELECT m.name, b.title, l.borrow_date, l.due_date 
FROM LOAN l
JOIN MEMBER m ON l.member_id = m.member_id
JOIN BOOK b ON l.book_id = b.book_id
WHERE l.return_date IS NULL;

-- UPDATE --> Return a book
UPDATE LOAN SET return_date = CURRENT_DATE WHERE loan_id = 1;
UPDATE BOOK SET is_available = TRUE WHERE book_id = 'ISBN001';

-- DELETE --> Remove a member
DELETE FROM MEMBER WHERE member_id = 'STU003';

-- ============================================================
-- ============================================================
-- ============================================================

-- Queries for Reporting

-- Overdue books
SELECT m.name, b.title, l.due_date 
FROM LOAN l
JOIN MEMBER m ON l.member_id = m.member_id
JOIN BOOK b ON l.book_id = b.book_id
WHERE l.return_date IS NULL AND l.due_date < CURRENT_DATE;

-- Most popular books
SELECT b.title, b.author, COUNT(l.loan_id) as times_borrowed
FROM BOOK b
LEFT JOIN LOAN l ON b.book_id = l.book_id
GROUP BY b.book_id, b.title, b.author
ORDER BY times_borrowed DESC;

-- Member borrowing history
SELECT m.name, b.title, l.borrow_date, l.return_date
FROM MEMBER m
JOIN LOAN l ON m.member_id = l.member_id
JOIN BOOK b ON l.book_id = b.book_id
WHERE m.member_id = 'STU001'
ORDER BY l.borrow_date DESC;