from unittest.mock import patch
from tests import TestBase
from mongoengine import Document, StringField, IntField


def mock_use_kwargs(f):
    def wrapper(*args, **kwargs):
        return f
    return wrapper

class Item(Document):   
    title = StringField()
    idx = IntField()

#@patch('webargs.flaskparser.use_kwargs', side_effect=mock_use_kwargs)
class DataTests(TestBase):
    """
    Tests for data utility methods
    """
    def test_sort_paginate(self, *args):
        import webargs.flaskparser
        webargs.flaskparser.use_kwargs = mock_use_kwargs
        from api.data import sort_paginate

        """
        Test for sort_paginate
        """
        class MockApi:
            """
            A mock API class
            """
            @sort_paginate(allow_sort=['idx'])
            def get_items(self, **kwargs):
                """
                Returns a list of items
                """
                return Item.objects

        for idx in range(1, 31):
            item = Item(title=f'Item {idx}', idx=idx)
            item.save()

        api = MockApi()
        items = api.get_items()
        self.assertEqual(30, len(items))
        items = api.get_items(limit=10)
        self.assertEqual(10, len(items))
        items = api.get_items(limit=10, sort='idx')
        self.assertEqual(10, len(items))
        self.assertEqual(1, items[0].idx)
        self.assertEqual(10, items[-1].idx)
        items = api.get_items(limit=10, offset=10, sort='idx')
        self.assertEqual(10, len(items))
        self.assertEqual(11, items[0].idx)
        self.assertEqual(20, items[-1].idx)
        items = api.get_items(limit=10, sort='idx', order='desc')
        self.assertEqual(10, len(items))
        self.assertEqual(30, items[0].idx)
        self.assertEqual(21, items[-1].idx)

    