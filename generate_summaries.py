#!/usr/bin/env python3
"""
Utility script to generate daily summaries for all existing minute data files.
This is useful when the owlet_daily_summaries folder is empty but you have minute data.
"""

import os
import sys
from pathlib import Path
from datetime import datetime
from owlet_sync import OwletSyncService

def generate_all_summaries():
    """Generate summaries for all dates that have minute data but no summary"""
    service = OwletSyncService()
    
    if service.config is None:
        print("Error: Cannot generate summaries without valid config")
        return
    
    minutes_dir = Path(service.minutes_dir)
    summaries_dir = Path(service.daily_summaries_dir)
    
    if not minutes_dir.exists():
        print(f"Error: Minutes directory '{minutes_dir}' does not exist")
        return
    
    # Get all minute files
    minute_files = list(minutes_dir.glob('owlet_minutes_*.json'))
    
    if not minute_files:
        print("No minute data files found")
        return
    
    print(f"Found {len(minute_files)} minute data file(s)")
    
    generated_count = 0
    skipped_count = 0
    
    for minute_file in minute_files:
        # Extract date from filename (format: owlet_minutes_YYYY-MM-DD.json)
        try:
            date_str = minute_file.stem.replace('owlet_minutes_', '')
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            print(f"Warning: Could not parse date from filename: {minute_file.name}")
            continue
        
        # Check if summary already exists
        summary_file = summaries_dir / f"owlet_summary_{date.isoformat()}.json"
        if summary_file.exists():
            print(f"  Skipping {date.isoformat()} - summary already exists")
            skipped_count += 1
            continue
        
        # Generate summary
        print(f"  Generating summary for {date.isoformat()}...")
        summary = service.aggregate_vitals_to_summary(date)
        
        if summary:
            if service.save_daily_summary(summary, date):
                print(f"    ✓ Successfully created summary for {date.isoformat()}")
                generated_count += 1
            else:
                print(f"    ✗ Failed to save summary for {date.isoformat()}")
        else:
            print(f"    ✗ Failed to generate summary for {date.isoformat()} (no data or error)")
    
    print(f"\nSummary:")
    print(f"  Generated: {generated_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Total: {len(minute_files)}")

if __name__ == '__main__':
    try:
        generate_all_summaries()
    except KeyboardInterrupt:
        print("\nInterrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

