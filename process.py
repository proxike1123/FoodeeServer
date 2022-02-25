import sys
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
sys.stdout.reconfigure(encoding='utf-8')

df1 = pd.read_json(str(sys.argv[2]), encoding='utf-8')

df1.columns = ['food_id', 'title', 'price', 'num_orders', 'category', 'avg_rating', 'num_rating',
                'tags']
# mean of average ratings of all items
C = df1['avg_rating'].mean()
# the minimum number of votes required to appear in recommendation list, 60th percentile among 'num_rating'
m = df1['num_rating'].quantile(0.6)
# items that qualify the criteria of minimum num of votes
q_items = df1.copy().loc[df1['num_rating'] >= m]

def create_soup(x):
    tags = x['tags'].lower().split(',')
    tags.extend(x['title'].lower().split())
    tags.extend(x['category'].lower().split())
    return " ".join(sorted(set(tags), key=tags.index))
df1['soup'] = df1.apply(create_soup, axis=1)
df1.head(3)

# create the count matrix
count = CountVectorizer()
# df1['soup']
count_matrix = count.fit_transform(df1['soup'])
# Compute the Cosine Similarity matrix based on the count_matrix
from sklearn.metrics.pairwise import cosine_similarity
cosine_sim = cosine_similarity(count_matrix, count_matrix)
indices_from_title = pd.Series(df1.index, index=df1['title'])
indices_from_food_id = pd.Series(df1.index, index=df1['food_id'])
# Function that takes in food title or food id as input and outputs most similar dishes

def get_recommendations(title="", cosine_sim=cosine_sim, idx=-1):
    # Get the index of the item that matches the title
    if idx == -1 and title != "":
        idx = indices_from_title[title]
    # Get the pairwsie similarity scores of all dishes with that dish
    sim_scores = list(enumerate(cosine_sim[idx]))
    # Sort the dishes based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # Get the scores of the 10 most similar dishes
    sim_scores = sim_scores[0:3]
    # Get the food indices
    food_indices = [i[0] for i in sim_scores]
    # Return the top 10 most similar dishes
    return food_indices

def get_latest_user_orders(user_id, orders, num_orders=3):
    counter = num_orders
    order_indices = []

    for index, row in orders[['user_id']].iterrows():
        if row.user_id == user_id:
            counter = counter - 1
            order_indices.append(index)
        if counter == 0:
            break

    return order_indices

# utility function that returns a DataFrame given the food_indices to be recommended
def get_recomms_df(food_indices, df1, columns):
    row = 0
    df = pd.DataFrame(columns=columns)
    for i in food_indices:
        df.loc[row] = df1[['title', 'price', 'food_id']].loc[i]
        row = row + 1
    return df

# return food_indices for accomplishing personalized recommendation using Count Vectorizer
def personalised_recomms(orders, df1, user_id, columns):
    order_indices = get_latest_user_orders(user_id, orders)
    food_ids = []
    food_indices = []
    recomm_indices = []
    for i in order_indices:
        food_ids.append(orders.loc[i].food_id)
    for i in food_ids:
        food_indices.append(indices_from_food_id[i])
    for i in food_indices:
        recomm_indices.extend(get_recommendations(idx=i))
    return get_recomms_df(set(recomm_indices), df1, columns)


orders = pd.read_json(str(sys.argv[1]), encoding='utf-8')
columns = ['title', 'price', 'food_id']
current_user = 2

per = personalised_recomms(orders, df1, current_user, columns)

print(per.to_json(orient='records',force_ascii=False))



