const generateSlug = (name) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
};

module.exports = { generateSlug };
