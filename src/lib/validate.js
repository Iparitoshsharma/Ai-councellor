// ---- Question file validation ---------------------------------------------
// Checks every question in a questions.json file and collects friendly
// error messages. If even one question has a problem, nothing is imported,
// so the question bank can never end up half-broken.

export const DIFFICULTIES = ['easy', 'medium', 'hard']
export const QUESTION_TYPES = ['direct', 'statement', 'match', 'assertion_reason']

export function validateQuestions(rawItems, existingIds = []) {
  const errors = []
  const warnings = []
  const questions = []
  const seenIds = new Set()

  if (!Array.isArray(rawItems)) {
    errors.push({
      question: '(the whole file)',
      field: 'file',
      message:
        'The file must be a LIST of questions: it should start with a [ and end with a ].',
    })
    return { questions, errors, warnings }
  }

  if (rawItems.length === 0) {
    errors.push({
      question: '(the whole file)',
      field: 'file',
      message: 'The file does not contain any questions.',
    })
    return { questions, errors, warnings }
  }

  rawItems.forEach((item, index) => {
    const label =
      item && typeof item === 'object' && item.id
        ? `Question ${item.id}`
        : `Question #${index + 1}`

    let itemHadError = false
    const addError = (field, message) => {
      errors.push({ question: label, field, message })
      itemHadError = true
    }
    const addWarning = (field, message) =>
      warnings.push({ question: label, field, message })

    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      addError('question', 'is not a question object. Each question must be wrapped in { } braces.')
      return
    }

    // ---- id ----
    if (typeof item.id !== 'string' || !item.id.trim()) {
      addError('id', 'is missing or empty. Give it a short unique name like "q001".')
    } else if (seenIds.has(item.id.trim())) {
      addError('id', `uses the id "${item.id.trim()}" which another question in this file already uses. Ids must be unique.`)
    } else if (existingIds.includes(item.id.trim())) {
      addError('id', `uses the id "${item.id.trim()}" which is already in the app. Change it, or pick "Replace all questions" when importing.`)
    } else {
      seenIds.add(item.id.trim())
    }

    // ---- chapter / topic ----
    if (typeof item.chapter !== 'string' || !item.chapter.trim()) {
      addError('chapter', 'is missing or empty.')
    }
    if (typeof item.topic !== 'string' || !item.topic.trim()) {
      addError('topic', 'is missing or empty.')
    }

    // ---- difficulty ----
    if (!DIFFICULTIES.includes(item.difficulty)) {
      addError('difficulty', 'must be exactly one of: ' + DIFFICULTIES.join(', ') + ' (found: ' + JSON.stringify(item.difficulty ?? null) + ').')
    }

    // ---- type ----
    if (!QUESTION_TYPES.includes(item.type)) {
      addError('type', 'must be exactly one of: ' + QUESTION_TYPES.join(', ') + ' (found: ' + JSON.stringify(item.type ?? null) + ').')
    }

    // ---- question text ----
    if (typeof item.question !== 'string' || !item.question.trim()) {
      addError('question', 'is missing or empty.')
    }

    // ---- options ----
    const optionsOk =
      Array.isArray(item.options) &&
      item.options.length >= 2 &&
      item.options.every((o) => typeof o === 'string' && o.trim() !== '')
    if (!optionsOk) {
      addError('options', 'must be a list of at least 2 answer choices, each one a piece of text like "Mars".')
    }

    // ---- correct_option ----
    if (!Number.isInteger(item.correct_option)) {
      addError('correct_option', 'must be a whole number: 0 for the first option, 1 for the second, and so on (found: ' + JSON.stringify(item.correct_option ?? null) + ').')
    } else if (optionsOk && (item.correct_option < 0 || item.correct_option >= item.options.length)) {
      addError('correct_option', `must be between 0 and ${item.options.length - 1} because that question has ${item.options.length} options.`)
    }

    // ---- explanation ----
    if (typeof item.explanation !== 'string' || !item.explanation.trim()) {
      addWarning('explanation', 'is empty. Explanations make revision much more useful, so add one if you can.')
    }

    // ---- source_page (optional, so it may be missing) ----
    if (item.source_page !== undefined && item.source_page !== null && !Number.isFinite(item.source_page)) {
      addError('source_page', 'must be a number, like 112 (found: ' + JSON.stringify(item.source_page) + ').')
    }

    if (itemHadError) return

    questions.push({
      id: item.id.trim(),
      chapter: item.chapter.trim(),
      topic: item.topic.trim(),
      difficulty: item.difficulty,
      type: item.type,
      question: item.question.trim(),
      options: item.options,
      correct_option: item.correct_option,
      explanation: typeof item.explanation === 'string' ? item.explanation.trim() : '',
      source_page:
        item.source_page === undefined || item.source_page === null
          ? null
          : item.source_page,
    })
  })

  return { questions, errors, warnings }
}
