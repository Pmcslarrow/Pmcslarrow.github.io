---
title: "⭐ Two-Tower Model for Recommender Systems"
description: "A book recommender system that learns about my user preferences"
date: 2025-11-01
tags: ["python", "pytorch", "pandas", "ML", "DL"]
weight: 1
---

<div>
    <img 
        src="/images/two_towers/two_towers.png" 
        alt="Two Towers Architecture Image"
        style="display: block; margin: 0 auto; width: 400px;"
    />
</div>

## Code

- The code can be found [within my github Repo](https://github.com/Pmcslarrow/booky/blob/main/notebooks/two_towers_final_edition.ipynb)
- There are other folders that are a work-in-progress for setting up the model registry with GCP. 

## Overview

I use a Two-Tower model to generate personalized book recommendations. During training, I include my own book interaction data so the model can learn a personalized User embedding that reflects my reading preferences.

After training, I extract and store all learned item embeddings in a vector index to enable fast similarity search. At inference time, the system computes a user’s embedding vector and performs an inner product with the item embeddings in the index to generate similarity scores for each book.

The model achieves approximately 31% Recall@25 on the test set across all users, and in my own manual evaluations, the recommendations are qualitatively strong and aligned with most of my reading preferences.

---

## Architecture Summary

The Two Towers architecture consists, believe it or not, of two towers. Mine consists of a **User tower** and an **Item tower**. The goal of each tower is to take input and generate a context-enriched embedding as output. 

#### User Tower
In my design, the user tower takes in a user's ID and a user's age (in bucket format). These are first passed into a `nn.embedding` layer which are concatenated together and then passed into the nerual net. The network then produces a latent output embedding that, if trained properly, contains information regarding the user. 

#### Item Tower
The item tower works in the same way as the user tower, although, it takes in information about the item a specific user reviewed. These features include the book's title, author, publisher, and year of publication (also in bucket format). 

#### Training
To see how much a user might like a book, we simply take the inner product of these two vectors (user and item embeddings). The higher the number, the more likely the model thinks the user will enjoy the book.

It is important to note that I trained this using **in-batch negative sampling**. Instead of explicitly picking negative examples from the whole dataset, I use a trick called in-batch negative sampling. This means that every other item in the same batch automatically becomes a negative example. 

If we pretend that our batch size is 4, and our logits look like this: [0.1, 0.2, 0.3, 0.4]. For our first training example, the correct item is the first element, 0.1. During training, I have softmax cross-entropy loss encourage the correct item within the numerator, and have the other three scores be the negative examples in the denominator. This is efficient because a single batch that already fits into our system contains both "positive" and "negative" examples for our recommender to encourage similarity to and discourage similarity from. 

---

## Results
The model was trained on a Goodreads dataset with relatively limited features, yet it still learned surprisingly strong patterns. I evaluated its performance using Recall@K. After training, the model achieved about 31% Recall@25, meaning that for each user in the test set, roughly 31% of the top 25 recommended books were ones they actually liked.

I also used human-evaluation as a metric. Since this product was made for my own interests, I had to look at what recommendations were made by the model and see if they made sense. I labeled [TRAIN] next to anything that could have been in the training data, [MISS] for any recommendation that wasn't in a genre I'd like or popular, [GOOD] to any recommendation that is in one of my go-to genres meaning it learned genres implicitly (scifi, history, classics, popular), [GREAT] to any recommendation that I really have thought about reading but wasn't sure if I really would love it. 

Below is a subset from real recommendations that my system made for my own user and age against all item embeddings:

```
[TRAIN] Title: Six Easy Pieces, Author: Richard P. Feynman, Score: 0.7779
[TRAIN] Title: How to Win Friends and Influence People, Author: Dale Carnegie, Score: 0.7675
[GOOD] Title: Journey to the End of the Night, Author: Louis-Ferdinand Celine, Score: 0.7586
[TRAIN] Title: The Elegant Universe, Author: Brian Greene, Score: 0.7285
[TRAIN] Title: A Haunting in Venice, Author: Agatha Christie, Score: 0.7267
[GOOD] Title: Notes from the Underground (Dover Thrift Editions), Author: Fyodor Dostoyevsky, Score: 0.6755
[TRAIN] Title: And Then There Were None, Author: Agatha Christie, Score: 0.6746
[MISS] Title: The Boggart, Author: Susan Cooper, Score: 0.6723
[GREAT] Title: Adventures of Huckleberry Finn (Dover Thrift Editions), Author: Mark Twain, Score: 0.6679
[GREAT] Title: LIFE UNIVERS EVRTH (Hitchhiker's Trilogy (Paperback)), Author: Douglas Adams, Score: 0.6565
[MISS] Title: Bicycle Official Rules of Card Games, Author: United States Playing Card Company, Score: 0.6501
[GOOD] Title: Kidnapped (Penguin Classics), Author: Robert Louis Stevenson, Score: 0.6501
[GOOD] Title: Inherit the Wind, Author: JEROME LAWRENCE, Score: 0.6487
[GOOD] Title: Tao Teh King: Nature and Intelligence, Author: Lao Tzu, Score: 0.6475
[MISS] Title: The Guinness Book of Film, Author: Tessa Clayton, Score: 0.6394
[GOOD] Title: Los Lagartos Terribles, Author: Isaac Asimov, Score: 0.6375
[GOOD] Title: Collected Poems 1947-1980, Author: Allen Ginsberg, Score: 0.6369
[MISS] Title: The Immortal Dragon, Author: Michael Peterson, Score: 0.6332
[GREAT] Title: Adventures of Huckleberry Finn, Author: Mark Twain, Score: 0.6314
[GREAT] Title: How to Stop Worrying and Start Living, Author: Dale Carnegie, Score: 0.6302
[GREAT] Title: Dune, Author: Frank Herbert, Score: 0.6300
[GOOD] Title: SO LONG THANK FISH (Hitchhiker's Trilogy (Paperback)), Author: Douglas Adams, Score: 0.6241
[GOOD] Title: Life on the Mississippi (Penguin Classics), Author: Mark Twain, Score: 0.6235
[MISS] Title: Like a Hole in the Head, Author: Jen Banbury, Score: 0.6214
[MISS] Title: Our Times, Author: Robert Atwan, Score: 0.6178
[TRAIN] Title: Julius Caesar, Author: William Shakespeare, Score: 0.6151
[MISS] Title: Time Travel: Fact, Fiction, &amp; Possibility, Author: Jenny Randles, Score: 0.6150
[GOOD] Title: L'Île du jour d'avant, Author: Umberto Eco, Score: 0.6146
[GOOD] Title: In Cold Blood: A True Account of a Multiple Murder and Its Consequences, Author: Truman Capote, Score: 0.6145
[GOOD] Title: Things Fall Apart, Author: Chinua Achebe, Score: 0.6139
[GOOD] Title: Dubliners, Author: James Joyce, Score: 0.6127
[TRAIN] Title: The Stranger, Author: Albert Camus, Score: 0.6117
[MISS] Title: When Bunny Grows Up, Author: Patsy Scarry, Score: 0.6095
[GREAT] Title: Of Mice and Men (Penguin Great Books of the 20th Century), Author: John Steinbeck, Score: 0.6091
[MISS] Title: Hollywood Glamor Portraits: 145 Photos of Stars, 1926-1949, Author: John Kobal, Score: 0.6083
[MISS] Title: SKINNY LEGS AND ALL, Author: TOM ROBBINS, Score: 0.6079
[MISS] Title: Dracula: A Symphony in Moonlight &amp; Nightmares, Author: Jon J. Muth, Score: 0.6078
[MISS] Title: Blood Money : How I Got Rich off a Woman's Right to Choose, Author: Carol Everett, Score: 0.6019
[GOOD] Title: The Adventures of Huckleberry Finn (English Library), Author: Mark Twain, Score: 0.6014
[GOOD] Title: The Jungle (Bantam Classics), Author: Upton Sinclair, Score: 0.6010
[GOOD] Title: Sir Gawain and the Green Knight (Penguin Classics ; L92), Author: Brian Stone, Score: 0.6008
[GOOD] Title: Genji Monogatari (Tut Books. L), Author: Shikibu Murasaki, Score: 0.6005
[MISS] Title: Sexy, Author: Candy Barr, Score: 0.5992
[GOOD] Title: By Any Means Necessary, Author: Malcolm X, Score: 0.5975
[MISS] Title: Shadowrun Companion: Beyond the Shadows, Author: Zach Bush, Score: 0.5966
[GOOD] Title: A Christmas Carol in Prose Being a Ghost Story of Christmas: In Prose : Being a Ghost Story of Christmas, Author: Charles Dickens, Score: 0.5944
[MISS] Title: The Obsessive Traveller: Or Why I Don't Steal Towels from Great Hotels Any More, Author: David Dale, Score: 0.5938
[TRAIN] Title: The Two Towers, Author: J.R.R. Tolkien, Score: 0.5925
[MISS] Title: Sherwood, Author: Parke Godwin, Score: 0.5923
[GOOD] Title: Masterpieces of murder, Author: Agatha Christie, Score: 0.5918
[GOOD] Title: SECRET GARDEN, Author: FRANCES HODGSON BURNETT, Score: 0.5915
[GOOD] Title: Madame Bovary (Penguin Popular Classics), Author: Gustave Flaubert, Score: 0.5911
[GOOD] Title: I And Thou, Author: Martin Buber, Score: 0.5878
[MISS] Title: Dave Barry in Cyberspace, Author: Dave Barry, Score: 0.5866
[GOOD] Title: Dispossessed, Author: Ursula K. Le Guin, Score: 0.5837
[GOOD] Title: The New Hugo Winners, Vol. 2, Author: Isaac Asimov, Score: 0.5831
[TRAIN] Title: How To Win Friends And Influence People, Author: Dale Carnegie, Score: 0.5831
[MISS] Title: Honest to God, Author: John Arthur Thomas Robinson, Score: 0.5828
[MISS] Title: The White Mercedes, Author: PHILIP PULLMAN, Score: 0.5823
[GREAT] Title: The TEMPEST, Author: William Shakespeare, Score: 0.5800
[MISS] Title: Lipstick on your collar, Author: Dennis Potter, Score: 0.5793
[GOOD] Title: El Alquimista, Author: Paulo Coelho, Score: 0.5789
[GREAT] Title: The Death of Ivan Ilyich, Author: LEO TOLSTOY, Score: 0.5786
[MISS] Title: Moderato Cantabile, Author: Marguerite Duras, Score: 0.5762
[GOOD] Title: Restaurant at the End of the Universe, Author: Douglas Adams, Score: 0.5762
[MISS] Title: Still Life with Woodpecker, Author: TOM ROBBINS, Score: 0.5756
[MISS] Title: Twilight Los Angeles, 1992: On the Road : A Search for American Character, Author: Anna Deavere Smith, Score: 0.5751
[GOOD] Title: Valis, Author: PHILIP K. DICK, Score: 0.5750
[GREAT] Title: A Tale of Two Cities (Oxford World's Classics), Author: Charles Dickens, Score: 0.5747
[GREAT] Title: The Tempest (Oxford World's Classics), Author: William Shakespeare, Score: 0.5744
[MISS] Title: Vacances anglaises, Author: Joseph Connolly, Score: 0.5730
[GOOD] Title: Age of Iron, Author: J. M. Coetzee, Score: 0.5727
[MISS] Title: No-Sew Applique: Holiday Magic, Author: Jean Wells, Score: 0.5722
[MISS] Title: The Loneliness of the Long-Distance Runner (Plume Contemporary Fiction), Author: Alan Sillitoe, Score: 0.5720
[GREAT] Title: LIFE, THE UNIVERSE AND EVERYTHING (Hitchhiker's Trilogy (Paperback)), Author: Douglas Adams, Score: 0.5708
[MISS] Title: Letters from the Inside, Author: John Marsden, Score: 0.5706
[GREAT] Title: Der Name der Rose., Author: Umberto Eco, Score: 0.5692
[GOOD] Title: Alice in Wonderland (Ladybird Children's Classics), Author: Lewis Carroll, Score: 0.5689
[MISS] Title: Guerra Del Tiempo, Author: Alejo Carpentier, Score: 0.5687
[GOOD] Title: As I Lay Dying: The Corrected Text (Vintage International), Author: William Faulkner, Score: 0.5686
[GOOD] Title: The Art of War, Author: Niccolò Machiavelli (classic), Score: 0.5674
[GOOD] Title: Adventures of Tom Sawyer (Children's Classics), Author: MARK TWAIN, Score: 0.5655
[GOOD] Title: The Woman Warrior: Memoirs of a Girlhood Among Ghosts, Author: Maxine Hong Kingston, Score: 0.5647
[GOOD] Title: Starship Titanic, Author: Douglas Adams, Score: 0.5646
[GREAT] Title: Dracula (Signet Classics (Paperback)), Author: Bram Stoker, Score: 0.5640
[GOOD] Title: Three Men in a Boat, to Say Nothing of the Dog! (Penguin Popular Classics), Author: Jerome K. Jerome, Score: 0.5638
[MISS] Title: MLA Handbook for Writers of Research Papers, Author: Joseph Gibaldi, Score: 0.5636
[MISS] Title: The New Real Book  (in C), Author: Chuck Sher, Score: 0.5617
[MISS] Title: Irish Red, Author: JIM KJELGAARD, Score: 0.5615
[GOOD] Title: Sister Carrie, Author: Theodore Dreiser, Score: 0.5608
[MISS] Title: Cassell’s French &amp; English Dictionary, Author: J. H. Douglas, Score: 0.5606
[GOOD] Title: Black Beauty, Author: Anna Sewell, Score: 0.5601
[MISS] Title: Paroles du Japon : haïkus, Author: Jean-Hugues Malineau, Score: 0.5595
[GOOD] Title: The Killer Angels, Author: Michael Shaara, Score: 0.5595
[GOOD] Title: Ethan Frome (Dover Thrift Editions), Author: Edith Wharton, Score: 0.5589
[GOOD] Title: Madame Bovary (Bantam Classics), Author: Gustave Flaubert, Score: 0.5585
[MISS] Title: O medo (Documenta poética), Author: Al Berto, Score: 0.5582
[GOOD] Title: Battle Cry of Freedom: The Civil War Era (Oxford History of the United States), Author: James M. McPherson, Score: 0.5582
[GOOD] Title: Tuck Everlasting, Author: Natalie Babbitt, Score: 0.5582
[GOOD] Title: MADAME BOVARY, Author: Gustave Flaubert, Score: 0.5576
```

---

## Summary & Extensions
- This might be my favorite project I’ve worked on, as it directly aligns with my studies at Northwestern and also serves as a personal passion project. Despite limited feature quality, I was able to build a two-tower model that learned to generate strong recommendations for a given user from hundreds of thousands of sparse examples.
- I achieved around 31% Recall@25 on the test set, which is very impressive.
- My future plans for this project include extending it beyond a notebook into a full application that I (and others) can use for book recommendations. I am working on deploying my UserTower to GCP so I can quickly hit an endpoint to retrieve a user’s embedding. I will then store my book item vectors in an index to efficiently compute similarity scores between the user embedding and all items in the trained index. This will allow me to easily recommend books to any user and let users input their own data for future offline training.
