const app = require("./App");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SkillSwap Server running smoothly on port ${PORT}`);
});