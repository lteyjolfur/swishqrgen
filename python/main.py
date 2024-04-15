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
        # Reduce the height of the image by 200px
        cropped_image = image.crop((0, 0, image.width, image.height - 200))
        
        # Create a mask with rounded corners
        mask = Image.new("L", cropped_image.size, 0)  # Create a transparent mask
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, cropped_image.width, cropped_image.height), radius, fill=255)
        
        # Make the cropped image's alpha channel according to the mask
        cropped_image.putalpha(mask)

        # Create a new image with the original size and paste the modified image onto it
        result_image = Image.new("RGBA", cropped_image.size, (0, 0, 0, 0))
        result_image.paste(cropped_image, (0, 0))
        
        return result_image
    
    def open_image_in_subfolder(image_name, subfolder):
        # Get the path to the current directory
        current_directory = os.path.dirname(__file__)

        # Construct the path to the image in the subfolder
        image_path = os.path.join(current_directory, subfolder, image_name)

        # Open the image
        image = Image.open(image_path)

        return image

    def process_images_in_subfolder(subfolder, corner_radius):
        # Get the path to the current directory
        current_directory = os.path.dirname(__file__)

        # Construct the path to the subfolder
        subfolder_path = os.path.join(current_directory, subfolder)

        # Loop through each file in the subfolder
        for filename in os.listdir(subfolder_path):
            if filename.endswith(".png"):
                # Open the image
                image_path = os.path.join(subfolder_path, filename)
                image = Image.open(image_path)

                # Add rounded corners to the image
                image_with_rounded_corners = make_corners_transparent(image, corner_radius)

                # Save or display the result
                # For demonstration purposes, let's save the modified images
                output_path = os.path.join(current_directory, subfolder+"_processed", f"rounded_{filename}")
                image_with_rounded_corners.save(output_path)

    # Define the radius for the rounded corners
    corner_radius = 52

    # Process images in the "assets" subfolder
    process_images_in_subfolder("assets", corner_radius)




if __name__ == "__main__":
    """ This is executed when run from the command line """
    main()