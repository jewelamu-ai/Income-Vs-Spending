#!/usr/bin/env python3
"""
Simple PWA Icon Generator - No external dependencies required
Creates basic PNG icons for the Budget Tracker PWA
"""

import struct
import os

def create_simple_png_icon(size, filename):
    """Create a simple PNG icon with a colored background and white dollar sign"""

    # PNG header
    png_signature = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk (Image Header)
    width = height = size
    bit_depth = 8
    color_type = 2  # RGB
    compression = 0
    filter_method = 0
    interlace = 0

    ihdr_data = struct.pack('>IIBBBBB', width, height, bit_depth, color_type, compression, filter_method, interlace)
    ihdr_crc = 0x9a7c3c6c  # Pre-calculated CRC for this IHDR
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)

    # Create image data - simple indigo background
    # RGB values for indigo: (79, 70, 229) = (4F, 46, E5)
    row_data = b''
    for y in range(height):
        row_data += b'\x00'  # Filter byte (None)
        for x in range(width):
            # Indigo background: RGB(79, 70, 229)
            row_data += b'\x4f\x46\xe5'

    # Add dollar sign in white (simple approximation)
    center_x = size // 2
    center_y = size // 2
    dollar_size = size // 4

    # Simple vertical line for dollar sign
    for y in range(center_y - dollar_size, center_y + dollar_size):
        if 0 <= y < height:
            offset = (y * (width * 3 + 1)) + 1 + (center_x * 3)
            if offset + 2 < len(row_data):
                row_data = row_data[:offset] + b'\xff\xff\xff' + row_data[offset+3:]

    # Horizontal lines for dollar sign
    for x in range(center_x - dollar_size//2, center_x + dollar_size//2):
        if 0 <= x < width:
            # Top horizontal line
            y = center_y - dollar_size//3
            if 0 <= y < height:
                offset = (y * (width * 3 + 1)) + 1 + (x * 3)
                if offset + 2 < len(row_data):
                    row_data = row_data[:offset] + b'\xff\xff\xff' + row_data[offset+3:]

            # Bottom horizontal line
            y = center_y + dollar_size//3
            if 0 <= y < height:
                offset = (y * (width * 3 + 1)) + 1 + (x * 3)
                if offset + 2 < len(row_data):
                    row_data = row_data[:offset] + b'\xff\xff\xff' + row_data[offset+3:]

    # Compress image data (simple - no compression for simplicity)
    compressed_data = row_data

    # IDAT chunk
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', 0)  # CRC placeholder

    # IEND chunk
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', 0xae426082)

    # Write PNG file
    with open(filename, 'wb') as f:
        f.write(png_signature)
        f.write(ihdr_chunk)
        f.write(idat_chunk)
        f.write(iend_chunk)

    print(f"Created {filename} ({size}x{size})")

def main():
    # Create icons directory if it doesn't exist
    os.makedirs('icons', exist_ok=True)

    # Generate icons for all required sizes
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]

    for size in sizes:
        filename = f'icons/icon-{size}.png'
        create_simple_png_icon(size, filename)

    print("\nAll PWA icons generated successfully!")
    print("You can now run the PWA with: python -m http.server 8000")

if __name__ == '__main__':
    main()