---
alias: /2011/03/game-review-scores-part-i/index.html
categories:
- Visualization
date: "2011-03-31T00:00:00Z"
header:
featured_image: /articles/development/game-review-scores-part-i/teaser.png
tags: []
thumbnail: /media/2011/03/histo-thumb.png
title: Game Review Scores - Part I
---

Studies have shown that a good review score can propel a game's [reputation](https://www.joystiq.com/2010/07/06/eedar-smu-study-review-scores-affect-perceived-quality-purchas). However, with such a large amount of data available, the two review aggregation sites simply present a single number for each game. With a wealth of review score data available, a few web scraping scripts, and a couple data analysis tools, some very interesting patterns emerge.

### The Data

The following charts are backed by 46,000 review scores for 800 games. They include only games for the Xbox360 and Playstation3 game consoles.

This article is broken up in to three parts:

- Part I - Scores
- [Part II - Sales]({{<relref game-review-scores-part-ii>}})
- [Part III - Tools]({{<relref game-review-scores-part-iii>}})

### Basic Score Distributions

In contrast to movie scores, game review scores tend to average higher. Looking at a basic distribution of raw review scores clearly illustrates that the scores center around 80.

{{<tableau "ReviewScores/ReviewScoreHistogram">}}

The distribution appears to be a normal distribution but it isn't symmetric. There are many distributions that model skewed data, such as Log-normal and Chi-square, but the [F-distribution](https://en.wikipedia.org/wiki/F-distribution) seemed to match the curve exactly.

### Score Consensus

If we group the review scores into decade buckets we can see that as games get better the consensus grows and review scores cluster closer to the mean.

{{<tableau "ReviewScores/ReviewScoreConsensus">}}

### Home Team Bias

There is no question that game reviews are subjective, but can it be measured?An obvious choice to examine is the [home team bias](https://bayesianheresy.blogspot.com/2007/01/home-team-bias-in-soccer.html). Given a large pool of 40,000 reviews with known developer and reviewer locations we can build a matrix to compare the the bias. The value represent the average deviation from the average review score for each game. In other words, if a region's reviewers consistently score locally developed games higher than the average you'll see a positive number measuring how many points, on average, that region is over-scored.

{{<tableau "ReviewScores/DevelopervsReviewerRegion">}}

The matrix illustrates two things - European reviewers tend to score slightly lower for all games than American reviewers, but more importantly, there is a home team advantage on both sides with European developers having a slight advantage. One or two percentage points may seem insignificant, but with so many scores bunched up around 77 a few points can mean a huge difference in relative rankings and perceived quality.

On average this difference is very small. However, some games elicit huge regional score differences. The following is a short list of non-licensed games with the largest spread between North American and European review scores.

{{<tableau "ReviewScores/RegionalReviewDifference">}}

### Game Licenses

Licensed games have a mixed reputation. On one hand sports games enjoy above average review scores, while on the other hand movie games are almost universally panned with an average more than 10 points below everything else. Ouch.

{{<tableau "ReviewScores/LicenseTypesCompared">}}

### Publishers

Finally, how are publishers doing with the pools of games they release each year?  Are they making good decisions about what to publish?  Here we see the average review scores coming out of each studio every year.

{{<tableau "ReviewScores/PublisherRatingsOverTime">}}

In [Part II]({{<relref game-review-scores-part-ii>}}) we'll examine how review scores relate to game sales.
