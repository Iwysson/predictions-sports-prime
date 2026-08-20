# Search Console Post-Deploy Checklist

- [ ] Confirm the authorized deployment completed successfully.
- [ ] Request the production homepage and confirm HTTP 200.
- [ ] Request `/robots.txt` and confirm HTTP 200 and the production sitemap URL.
- [ ] Request `/sitemap.xml`, confirm HTTP 200 and validate it externally.
- [ ] Test one published match page and its canonical URL.
- [ ] Inspect raw source HTML for title, description, canonical, H1, main content and JSON-LD.
- [ ] Test the homepage and representative match page on mobile.
- [ ] Submit the sitemap once in Google Search Console.
- [ ] Inspect the homepage and one representative match URL.
- [ ] Request indexing only when the deployed URL is canonical, indexable and final.
- [ ] Monitor Page indexing and sitemap processing over time.
- [ ] Do not repeatedly resubmit the sitemap without a concrete reason.
