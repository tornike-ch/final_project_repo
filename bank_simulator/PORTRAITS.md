# Customer photos (professional look)

The game can show **realistic photos of customers** instead of the illustrated faces. Each person needs **five photos with the same framing and light, but different expressions**. The face is the only mood signal in the game, so these five photos carry the "customer mood" mechanic.

| File | Expression | When the game shows it |
|---|---|---|
| `angry` | angry, frowning, tense jaw | mood −3 / −2 |
| `annoyed` | annoyed, impatient, lips pressed | mood −1 |
| `neutral` (**required**) | neutral, attentive | mood 0, also used on ID documents |
| `pleased` | slight, polite smile | mood +1 |
| `happy` | warm, open smile | mood +2 / +3 |

Upload them in **Builder → Customer photos** (one "person" per set: id, gender, age, five photos). The builder resizes photos to 600 px JPEG and embeds them in the SCORM package. Cases pick a person automatically by gender and age, or explicitly with `"customer": { "portrait": "<id>" }`.

## Technical specs
- **Framing:** head and shoulders, face in the upper third, looking at the camera. The game crops to a wide "camera view", so leave some space around the head.
- **Orientation:** portrait (4:5) or square, at least 600 px.
- **Consistency:** the same background, light, clothes and camera position in all five photos. Only the expression changes.
- **Background:** a calm, slightly blurred bank branch interior or a plain light-grey studio background.
- **Variety:** at least **8–10 people** of different ages and genders (for example women and men aged 20s, 30s, 40s, 50s, 60+, 70+), so cases don't repeat faces.

## Three ways to produce them

### 1. Photoshop "Smart Portrait" (fastest, consistent identity)
1. Get **one neutral photo** per person: a photo shoot, a licensed Adobe Stock photo (with a model release), or a Firefly-generated person.
2. In Photoshop: **Filter → Neural Filters → Smart Portrait**. Use the **Happiness** slider for `pleased` and `happy`, and **Anger** for `annoyed` and `angry`, and export the five versions.

The identity stays exactly the same, which is what the game needs.

### 2. Adobe Firefly (generated people, no real person involved)
Generate the neutral portrait first with a prompt like:

> Photorealistic head-and-shoulders portrait of a {35-year-old Georgian woman, school teacher, shoulder-length dark hair, casual blouse}, standing at a bank branch counter, softly blurred modern bank interior background, natural soft light, looking at the camera, neutral attentive expression, 50 mm lens, 4:5

Then create the other expressions from that image, either with Firefly **Generative fill** on the face ("same woman, angry frowning expression") or with Photoshop Smart Portrait (option 1). Do not generate each expression from scratch, because you would get a different person each time.

**Suggested people**, matching the sample cases:

| Who | Description |
|---|---|
| woman, 34 | teacher, dark hair |
| man, 46 | engineer, short beard |
| man, 24 | IT, casual |
| woman, 29–31 | marketing / architect |
| man, 52 | shop owner, receding hair |
| woman, 74 | pensioner, grey hair, glasses |
| man, 38 | taxi driver |
| man, 42 | logistics manager |

### 3. Photo shoot with consenting people
Five expressions per person in about 10 minutes, same chair, light and background.
- You need **written consent** (a model release) for use in internal training.
- Never use photos of real customers.

## Legal
- Use only generated people, licensed stock with a model release, or people who signed consent.
- Don't use recognisable public figures or real customers.
- Keep the credit line for the Micah illustrations only while the illustrated faces are still in use.
