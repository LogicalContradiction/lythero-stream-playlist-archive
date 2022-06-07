import json
from pathlib import Path

filepath = Path(__file__).parent / "trackData.js"
outputFile = Path(__file__).parent / "data.txt"

with open(filepath, "r", encoding="utf8") as file:
    data = file.readlines()

dataString = "".join(data)    

jsonData = json.loads(dataString[15:])

result = []

counter = 1
for item in jsonData:
    if "youtu.be" in item["songLink"] and "?t=" not in item["songLink"]:
        result.append(item["songLink"].replace("https://youtu.be/",""))
        if counter == 100:
            result.append("\n")
            counter = 1
        else:
            counter += 1
       
with open(outputFile, "w", encoding="utf8") as file:
    file.write("\n".join(result))
        



