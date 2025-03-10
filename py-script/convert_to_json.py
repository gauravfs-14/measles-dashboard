import pandas as pd
import os
import sys

try:
    # Set up base, raw, and json directories using absolute paths
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "data"))
    raw_dir = os.path.join(base_dir, "raw")
    json_dir = os.path.join(base_dir, "json")

    # Create output directory if it doesn't exist
    os.makedirs(json_dir, exist_ok=True)

    # Check if input file exists
    excel_file = os.path.join(raw_dir, "mmr_map_kinder.xlsx")
    if not os.path.exists(excel_file):
        raise FileNotFoundError(f"Input file not found: {excel_file}")

    # Read Excel file using absolute path - skip header row as it's not a column header
    df = pd.read_excel(excel_file, header=None)
    
    # Get county names from row 1 (index 0)
    counties = df.iloc[1].tolist()
    # Get percentages from row 2 (index 1)
    percentages = df.iloc[2].tolist()
    
    # Create a new DataFrame with the correct structure
    df_structured = pd.DataFrame({
        'county': counties,
        'percentage': percentages
    })

    # Convert to JSON
    json_data = df_structured.to_json(orient="records", indent=2)

    # Write to JSON file using absolute path
    output_file = os.path.join(json_dir, "mmr_map_kinder_long.json")
    with open(output_file, "w") as f:
        f.write(json_data)
    
    print(f"Successfully created: {output_file}")

except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
