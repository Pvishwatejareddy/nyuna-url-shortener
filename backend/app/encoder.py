# The Base62 alphabet - all characters we can use
ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
BASE = len(ALPHABET)  # This is 62

def encode(number: int) -> str:
    """Convert a number into a short Base62 string"""
    # If number is 0, return the first character
    if number == 0:
        return ALPHABET[0]
    
    result = ""
    
    while number > 0:
        # Get the remainder when divided by 62
        remainder = number % BASE
        # Add the matching character to our result
        result = ALPHABET[remainder] + result
        # Divide the number by 62 and continue
        number = number // BASE
    
    return result


def decode(short_code: str) -> int:
    """Convert a Base62 string back into a number"""
    result = 0
    
    for character in short_code:
        # Find where this character sits in our alphabet
        position = ALPHABET.index(character)
        # Build the number back up
        result = result * BASE + position
    
    return result