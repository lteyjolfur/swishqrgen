#!/usr/bin/env python3
"""
Module Docstring
"""
import os
from PIL import Image, ImageDraw, ImageOps
__author__ = "Your Name"
__version__ = "0.1.0"
__license__ = "MIT"



def main():
    """ Main entry point of the app """
    print("hello world")

    def make_corners_transparent(image, radius):
        # Create a mask with rounded corners
        mask = Image.new("L", image.size, 0)  # Create a white mask
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, image.width, image.height-200), radius, fill=255)
        
        # Make the image's alpha channel according to the inverted mask
        image.putalpha(mask)

        return image
    
    def open_image_in_subfolder(image_name, subfolder):
        # Get the path to the current directory
        current_directory = os.path.dirname(__file__)

        # Construct the path to the image in the subfolder
        image_path = os.path.join(current_directory, subfolder, image_name)

        # Open the image
        image = Image.open(image_path)

        return image

    image = open_image_in_subfolder("Medlemsavgift Aktiv.png", "assets")

    # Define the radius for the rounded corners
    corner_radius = 52
    # Add rounded corners to the image
    image_with_rounded_corners = make_corners_transparent(image, corner_radius)

    # Save or display the result
    image_with_rounded_corners.show()




if __name__ == "__main__":
    """ This is executed when run from the command line """
    main()