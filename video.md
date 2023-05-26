# Video Encoder

`video-encoder.js` is a example application to demonstrate the interactions and unexpected behavior arising from interacting adaptations.

## Program

The program to evaluate is shown in the following

## Precision and Recall

| Analysis | Instances | True Positives | False Positives | False Negatives | Precision | Recall |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
Baseline | 3 | 1 | | 2 | | 0.33
Whole Program | 3 |
**Our** | 3 | 3 | | 0 | | 1

## Performance

All times are shown in ms.

| Analysis | No. of Nodes | No. of Edges | Processing time | Analysis time |
| ---- | ---- | ---- | ---- | ---- |
Baseline | 116 | 115 | 665 ± 25.4 | 398 ± 10.4
Whole Program | 211 | 214 | 858 ± 25.5 | 539  18.6
**Our** | 120 | 119 | 727 ± 29.9 | 321 ± 25.3