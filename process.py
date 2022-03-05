import sys
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
sys.stdout.reconfigure(encoding='utf-8')

df1 = pd.read_json(str(sys.argv[2]), encoding='utf-8')

df1.columns = ['product_id', 'name', 'price', 'avatar', 'cate_id', 'sale','tag','shop_id', '_id']

def create_soup(x):
    tags = x['tag'].lower().split(',')
    tags.extend(x['name'].lower().split())
    tags.extend(x['cate_id'].lower().split())
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
indices_from_name = pd.Series(df1.index, index=df1['name'])
indices_from_product_id = pd.Series(df1.index, index=df1['product_id'])
# Function that takes in food name or food id as input and outputs most similar dishes

def get_recommendations(name="", cosine_sim=cosine_sim, idx=-1):
    # Get the index of the item that matches the name
    if idx == -1 and name != "":
        idx = indices_from_name[name]
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

def get_latest_user_orders(user_id, orders, num_orders=10):
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
        df.loc[row] = df1[['product_id', 'name', 'price', 'avatar', 'cate_id', 'sale',
                'tag','shop_id', '_id']].loc[i]
        row = row + 1
    return df

# return food_indices for accomplishing personalized recommendation using Count Vectorizer
def personalised_recomms(orders, df1, user_id, columns):
    order_indices = get_latest_user_orders(user_id, orders)
    product_ids = []
    food_indices = []
    recomm_indices = []
    for i in order_indices:
        product_ids.append(orders.loc[i].product_id)
    for i in product_ids:
        food_indices.append(indices_from_product_id[i])
    for i in food_indices:
        recomm_indices.extend(get_recommendations(idx=i))
    new_recoms = list(dict.fromkeys(recomm_indices))
    return get_recomms_df(new_recoms, df1, columns)


orders = pd.read_json(str(sys.argv[1]), encoding='utf-8')

columns = ['product_id', 'name', 'price', 'avatar', 'cate_id', 'sale',
                'tag','shop_id', '_id']
current_user = 1

per = personalised_recomms(orders, df1, current_user, columns)

print(per.to_json(orient='records',force_ascii=False))



