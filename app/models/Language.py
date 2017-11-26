from misc import lang_path
from json import loads as json_loads
from hashlib import md5

# JSON of languages
with open(lang_path) as lang_data:
    languages = json_loads(lang_data)

class Language(object):
    """
    Supplies all known information about a language. Make an instance using the
    language id. If a language does not exist then this will *not* error however
    some functions will return `None` appropriately.
    """
    def __init__(self, id):
        self._id = languages['alias'].get(id, id)

        # Should not fail otherwise you have malformed source code
        self._data = languages['languages'].get(id, None)

    def get_color():
        return md5(self._id.encode('ascii')).hexdigest()[:6]

    def get_display_name():
        # Return display name. If that doesn't exist, capitalize each letter
        # following a whitespace char

        if self._data is None:
            return None

        return self._data.get('display', this._id.title())

    def to_json():
        """
        May not return a JSON object
        """
        return self._id

    def get_tio_id():
        """
        Returns the id as a string or None if the languages is not supported on
        TIO.
        """
        if self._data is None:
            return None

        tio_id = languages['tio'].get(self._id, self._id)

        # 0 in JSON means TIO is not supported
        if tio_id == 0:
            return None

        return tio_id
