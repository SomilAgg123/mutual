import boto3
from boto3.dynamodb.conditions import Key, Attr

# dynamo_client = boto3.client('dynamodb')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table("Photos")

class DynamoDB():
    def get_items(user_id, priority=None):
            user_id = int(user_id)
            if priority != None:
                response = table.scan(
                    FilterExpression=Attr('UserID').eq(user_id) & Attr('Priority').eq(priority)
                )

            else:
                response = table.query(
                    KeyConditionExpression=Key('UserID').eq(user_id)
                )

            items = response['Items']
            return items

    def put_items(profile_id, url, priority):
        table.put_item(
            Item={
                'UserID' : profile_id,
                'PhotoURL' : url,
                'Priority' : priority
            }
        )