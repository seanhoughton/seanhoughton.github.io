---
alias: /2011/03/game-review-scores-part-ii/index.html
categories:
- Visualization
date: "2011-03-31T00:00:00Z"
header:
featured_image: /articles/development/game-review-scores-part-ii/teaser.png
tags: []
thumbnail: /media/2011/03/scatter-thumb.png
title: Game Review Scores - Part II
---
In [Part I]({{<relref game-review-scores-part-i>}}) we looked at review scores in isolation. When we combine review score data with sales data some interesting patterns emerge. This section includes sales data from around 7,000 Xbox360 and Playstation2 games as well as the review score data from [Part I]({{<relref game-review-scores-part-i>}})

### Sales and Scores

An interesting property of the sales data is the lack of sales variation below a score of 70. Games that score above this threshold show a clear trend of increasing sales. However, games that score below it appear to have an uniform distribution of prosperity. In other words, your review score doesn't make one bit of difference in sales if you can't manage to make a game that scores better than 70.  However, if you can push the quality from an 85 to a 95 you're likely to be rewarded with triple the sales.

{{<tableau "ReviewScores/SalesScorePlot">}}


You can use the following chart to compare sales broken down by console.

{{<tableau "ReviewScores/GameSalesLookup">}}


### Voting with Your Wallet

In [Part I]({{<relref game-review-scores-part-i>}}) we looked examined the bias of game reviewers.  Here we can compare what consumers prefer by comparing from which region they buy games.  The diagonal shows that each region prefers games made by developers in that region.  North American and European consumers show a moderate favoritism for local developers.  However, Japan heavily favors products made by Asian developers with 72% of all sales going to home made games.

{{<tableau "ReviewScores/RegionalSalesBias">}}


### Historical Sales

Sale have seen a steady increase over the last 14 years with an apparent periodic stall. Is this steady increase caused by an increase in the quality of games produced?  The following chart plots the sales trend in each region.  We can see that 2003 suffered a sales drop and the last two years have also seen stagnation.

{{<tableau "ReviewScores/RegionalSales">}}


Now, if we take each year's average review score and plot it against that years total sales something strange happens: apparently as the overall pool of games gets worse, people buy more games!

{{<tableau "ReviewScores/YearlyReviewvsSales">}}


This seems to contradict our earlier findings that ratings directly affect sales.  Let's take a look at the historical review averages and see if they are getting better or worse.

{{<tableau "ReviewScores/GameReviewScoreTrends">}}

So review scores dipped while sales climbed.  It seems that while high-quality games gain sales with high review scores the sheer number of games available and the growing popularity of gaming in general overcomes the quality trends.

### More Games, Less Quality, More Sales

This section sums up the relationship between all of these things.  As more games are released the average quality goes down.  However, the total sales go up.

{{<tableau "ReviewScores/MoreGamesLowerQuality">}}


### More Information

The final post, [Part III]({{< relref "game-review-scores-part-iii" >}}), covers some of the tools used.
