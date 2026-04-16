-- Add language_code column to characters table
ALTER TABLE characters 
ADD COLUMN language_code VARCHAR(10) DEFAULT 'hi' NOT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN characters.language_code IS 'Primary language of the character (e.g., hi, bn, ta, en)';
