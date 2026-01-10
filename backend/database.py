"""
Database operations for DynamoDB.
"""

import boto3
import os
import json
from typing import Dict, List, Optional
from datetime import datetime

class DynamoDBManager:
    """Manager for DynamoDB operations."""
    
    def __init__(self, table_name: str = "berth-scheduling-solutions", 
                 region: str = None, endpoint_url: str = None):
        """
        Initialize DynamoDB manager.
        
        Args:
            table_name: Name of the DynamoDB table
            region: AWS region (defaults to env or 'us-east-1')
            endpoint_url: Optional endpoint URL for local development (LocalStack)
        """
        self.table_name = table_name
        self.region = region or os.getenv('AWS_REGION', 'us-east-1')
        self.endpoint_url = endpoint_url or os.getenv('DYNAMODB_ENDPOINT_URL', None)
        
        # Create DynamoDB resource
        if self.endpoint_url:
            self.dynamodb = boto3.resource(
                'dynamodb',
                region_name=self.region,
                endpoint_url=self.endpoint_url,
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID', 'test'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY', 'test')
            )
        else:
            self.dynamodb = boto3.resource('dynamodb', region_name=self.region)
        
        self.table = self.dynamodb.Table(table_name)
    
    def create_table(self):
        """Create the DynamoDB table if it doesn't exist."""
        try:
            table = self.dynamodb.create_table(
                TableName=self.table_name,
                KeySchema=[
                    {'AttributeName': 'problem_id', 'KeyType': 'HASH'},
                    {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}
                ],
                AttributeDefinitions=[
                    {'AttributeName': 'problem_id', 'AttributeType': 'S'},
                    {'AttributeName': 'timestamp', 'AttributeType': 'S'}
                ],
                BillingMode='PAY_PER_REQUEST'
            )
            print(f"Created table {self.table_name}")
            return table
        except Exception as e:
            print(f"Table creation error (may already exist): {e}")
            return self.table
    
    def save_solution(self, problem_id: str, solution_data: Dict) -> bool:
        """
        Save a scheduling solution to DynamoDB.
        
        Args:
            problem_id: Unique problem identifier
            solution_data: Dictionary containing the solution data
        
        Returns:
            True if successful
        """
        try:
            item = {
                'problem_id': problem_id,
                'timestamp': solution_data.get('timestamp', datetime.utcnow().isoformat()),
                'makespan': solution_data.get('makespan', 0),
                'solving_time': str(solution_data.get('solving_time', 0)),
                'num_vessels': len(solution_data.get('vessels', [])),
                'schedule_json': json.dumps(solution_data.get('schedule', {})),
                'vessels_json': json.dumps([v.dict() if hasattr(v, 'dict') else v 
                                          for v in solution_data.get('vessels', [])])
            }
            
            self.table.put_item(Item=item)
            return True
        except Exception as e:
            print(f"Error saving solution: {e}")
            return False
    
    def get_solution(self, problem_id: str, timestamp: Optional[str] = None) -> Optional[Dict]:
        """
        Retrieve a solution from DynamoDB.
        
        Args:
            problem_id: Problem identifier
            timestamp: Optional timestamp for composite key (if multiple solutions per ID)
        
        Returns:
            Solution dictionary or None if not found
        """
        try:
            # Get the most recent solution if timestamp not specified
            if timestamp is None:
                response = self.table.query(
                    KeyConditionExpression='problem_id = :pid',
                    ExpressionAttributeValues={':pid': problem_id},
                    ScanIndexForward=False,
                    Limit=1
                )
                items = response.get('Items', [])
                if not items:
                    return None
                item = items[0]
            else:
                response = self.table.get_item(
                    Key={'problem_id': problem_id, 'timestamp': timestamp}
                )
                item = response.get('Item')
                if not item:
                    return None
            
            # Parse JSON fields
            item['schedule'] = json.loads(item.get('schedule_json', '{}'))
            item['vessels'] = json.loads(item.get('vessels_json', '[]'))
            
            return item
        except Exception as e:
            print(f"Error retrieving solution: {e}")
            return None
    
    def list_solutions(self, limit: int = 10) -> List[Dict]:
        """
        List recent solutions from DynamoDB.
        
        Args:
            limit: Maximum number of solutions to return
        
        Returns:
            List of solution summaries
        """
        try:
            response = self.table.scan(Limit=limit)
            items = response.get('Items', [])
            
            # Parse and summarize
            solutions = []
            for item in items:
                solutions.append({
                    'problem_id': item.get('problem_id'),
                    'timestamp': item.get('timestamp'),
                    'makespan': item.get('makespan'),
                    'solving_time': item.get('solving_time'),
                    'num_vessels': item.get('num_vessels')
                })
            
            # Sort by timestamp descending
            solutions.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            
            return solutions
        except Exception as e:
            print(f"Error listing solutions: {e}")
            return []
    
    def delete_solution(self, problem_id: str) -> bool:
        """
        Delete a solution from DynamoDB.
        
        Args:
            problem_id: Problem identifier
        
        Returns:
            True if successful
        """
        try:
            # Get all items with this problem_id first
            response = self.table.query(
                KeyConditionExpression='problem_id = :pid',
                ExpressionAttributeValues={':pid': problem_id}
            )
            
            # Delete each item
            with self.table.batch_writer() as batch:
                for item in response.get('Items', []):
                    batch.delete_item(
                        Key={
                            'problem_id': item['problem_id'],
                            'timestamp': item['timestamp']
                        }
                    )
            
            return True
        except Exception as e:
            print(f"Error deleting solution: {e}")
            return False
