# Event-Driven Widget Refresh Strategy

We decided to trigger native OS home screen widget updates directly upon local state mutations (creating, confirming, completing, or editing a task) combined with a scheduled midnight background timeline update. This respects iOS/Android background execution limits while ensuring real-time widget accuracy.
