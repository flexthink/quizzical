#pylint: disable=E1101
"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

API - utilities for dealing with data
"""

from enum import Enum

from webargs import fields
from webargs.flaskparser import use_kwargs

_sort_paginate_args = {
    'sort': fields.Str(required=False),
    'order': fields.Str(required=False),
    'limit': fields.Int(required=False, default=10),
    'offset': fields.Int(required=False, default=0)
}


class SortOrder(Enum):
    """
    Respresents the sort order (ascending or descending)
    """
    ASC = 'asc'
    DESC = 'desc'

def sort_paginate_params(api):
    """
    A decorator that adds sorting and pagination parameters
    to a REST resource
    """
    def wrapper(resource):
        resource = api.param('sort', 'The field to sort by')(resource)
        resource = api.param('order', 'The sort order ("asc" for ascending, "desc" for descending)')(resource)
        resource = api.param('limit', 'The maximum number of items to return')(resource)
        resource = api.param('offset', 'The offset for pagination')(resource)
        return resource
    return wrapper



def sort_paginate(allow_sort=None):
    """
    A decorator that adds sorting and pagination functionality to data
    retrieval methods. The method is expected to return a MongoEngine
    QuerySet
    """    
    def wrapper(data_function):
        @use_kwargs(_sort_paginate_args)
        def sorted_paginated_call(self, limit=None, offset=None, sort=None, order=None, **kwargs):
            if allow_sort and sort and sort not in allow_sort:
                raise ValueError(f"Unable to sort by {sort}")
            data = data_function(self, **kwargs)
            if limit:
                data = data.limit(limit)
            if offset:
                data = data.skip(offset)
            if sort:
                if order == SortOrder.DESC.value:
                    sort = f'-{sort}'
                data = data.order_by(sort)
            return list(data)
        return sorted_paginated_call
    return wrapper
