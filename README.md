# Translate or fill the empty strings of your JSON locales with the help of Chat-GPT

[Demo](https://ai-json-translator.vercel.app/)

To get this running either:

- create a `.env` file with your `OPENAI_KEY`
- paste your key into the provided Textfield

Wit this small application you can paste in your locales JSON file, which might look somehing like this:

```json
{
  "hello": "",
  "world": ""
}
```

or

```json
{
  "hello": "Hello",
  "world": "World"
}
```

Depending on the mode you choose it will either:

- Try to fill the empty strings based on the name of the key
- Translate the given values into the desired language
