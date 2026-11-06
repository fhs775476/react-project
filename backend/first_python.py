import json
site_name="react-project"

def get_site_name():
    data={"name":"hello","age":30,"from":site_name}
    return json.dumps(data)

print(get_site_name())