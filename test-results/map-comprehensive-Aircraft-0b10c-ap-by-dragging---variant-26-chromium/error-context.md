# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - generic [ref=e5]:
      - link "✈️ StratoView" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: ✈️
        - generic [ref=e8]: StratoView
      - generic [ref=e9]:
        - link "Live Map" [ref=e10] [cursor=pointer]:
          - /url: /map
        - link "Dashboard" [ref=e11] [cursor=pointer]:
          - /url: /dashboard
        - link "Sign In" [ref=e12] [cursor=pointer]:
          - /url: /auth/signin
  - generic [ref=e13]:
    - generic [ref=e15]: Loading map...
    - button "🔍 Filters" [ref=e16] [cursor=pointer]
    - generic [ref=e17]:
      - generic [ref=e18]: "0"
      - generic [ref=e19]: Aircraft Tracked
      - generic [ref=e21]: "Source: UNKNOWN"
    - generic [ref=e22]:
      - heading "Planes Above Me" [level=3] [ref=e23]
      - generic [ref=e24]:
        - combobox [ref=e25]:
          - option "10 miles"
          - option "25 miles" [selected]
          - option "50 miles"
        - button "Find Nearby" [ref=e26] [cursor=pointer]
```