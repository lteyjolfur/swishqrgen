import unittest
from PIL import Image
import os
from main import make_corners_transparent

class TestImageProcessing(unittest.TestCase):
    def setUp(self):
        # Create a simple test image (1000x1000, white)
        self.img = Image.new('RGBA', (1000, 1000), (255, 255, 255, 255))

    def test_make_corners_transparent(self):
        result = make_corners_transparent(self.img, 20)
        self.assertEqual(result.size, (1000, 800))
        # Check that the corners are transparent (alpha close to 0)
        self.assertLess(result.getpixel((0, 0))[3], 10)
        self.assertLess(result.getpixel((999, 0))[3], 10)
        self.assertLess(result.getpixel((0, 799))[3], 10)
        self.assertLess(result.getpixel((999, 799))[3], 10)

if __name__ == '__main__':
    unittest.main()
