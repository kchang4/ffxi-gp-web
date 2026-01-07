
import re
import json

def parse_sql_line(line):
    # Matches: INSERT INTO `guild_item_points` VALUES (guildid, itemid, rank, points, max_points, pattern); -- Item Name (Points / Max)
    # Note: The comments might vary or be missing, so we focus on the VALUES (...)
    match = re.search(r"VALUES \((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\); -- (.*) \(", line)
    if match:
        return {
            "guildId": int(match.group(1)),
            "itemId": int(match.group(2)),
            "rank": int(match.group(3)),
            "points": int(match.group(4)),
            "maxPoints": int(match.group(5)),
            "pattern": int(match.group(6)),
            "itemName": match.group(7).strip()
        }
    return None

data = []
with open("guild_data_raw.sql", "r") as f:
    for line in f:
        parsed = parse_sql_line(line)
        if parsed:
            data.append(parsed)

# Reorganize into a dictionary for easier lookup: GuildID -> Pattern -> Rank -> Item
# Or just keep as array and filter in JS? Array is fine for 5 guilds.
structured = {}

for entry in data:
    gid = entry["guildId"]
    pat = entry["pattern"]
    rank = entry["rank"]
    
    if gid not in structured: structured[gid] = {}
    if pat not in structured[gid]: structured[gid][pat] = {}
    if rank not in structured[gid][pat]: structured[gid][pat][rank] = []
    
    structured[gid][pat][rank].append({
        "name": entry["itemName"],
        "id": entry["itemId"],
        "points": entry["points"],
        "max": entry["maxPoints"]
    })

print(json.dumps(structured, indent=2))
