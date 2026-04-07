export interface ProblemTestCase {
  input: string;
  expectedOutput: string;
}

export interface CodingProblem {
  problem_id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: 'Python';
  expected_output: string;
  tags: string[];
  test_cases: ProblemTestCase[];
}

export const problems20: CodingProblem[] = [
  { problem_id: '101', title: 'Prime Check', description: 'Write a Python function that returns True if a number is prime, otherwise False.', difficulty: 'Easy', language: 'Python', expected_output: 'Boolean', tags: ['math', 'conditionals'], test_cases: [{ input: '2', expectedOutput: 'True' }, { input: '3', expectedOutput: 'True' }, { input: '4', expectedOutput: 'False' }, { input: '-1', expectedOutput: 'False' }, { input: '0', expectedOutput: 'False' }] },
  { problem_id: '102', title: 'Factorial', description: 'Return factorial of n. Handle n < 0 by returning None.', difficulty: 'Easy', language: 'Python', expected_output: 'Integer or None', tags: ['recursion'], test_cases: [{ input: '0', expectedOutput: '1' }, { input: '5', expectedOutput: '120' }, { input: '-2', expectedOutput: 'None' }] },
  { problem_id: '103', title: 'Palindrome String', description: 'Check if a string is palindrome ignoring case and spaces.', difficulty: 'Easy', language: 'Python', expected_output: 'Boolean', tags: ['strings'], test_cases: [{ input: '"madam"', expectedOutput: 'True' }, { input: '"A man a plan a canal Panama"', expectedOutput: 'True' }, { input: '"hello"', expectedOutput: 'False' }] },
  { problem_id: '104', title: 'Fibonacci Nth', description: 'Return nth Fibonacci number where F0=0, F1=1.', difficulty: 'Easy', language: 'Python', expected_output: 'Integer', tags: ['dp'], test_cases: [{ input: '0', expectedOutput: '0' }, { input: '1', expectedOutput: '1' }, { input: '7', expectedOutput: '13' }] },
  { problem_id: '105', title: 'Array Sum', description: 'Return sum of integers in array.', difficulty: 'Easy', language: 'Python', expected_output: 'Integer', tags: ['arrays'], test_cases: [{ input: '[1,2,3]', expectedOutput: '6' }, { input: '[]', expectedOutput: '0' }] },
  { problem_id: '106', title: 'Max In List', description: 'Return maximum value from list. If empty return None.', difficulty: 'Easy', language: 'Python', expected_output: 'Integer or None', tags: ['arrays'], test_cases: [{ input: '[4,9,1]', expectedOutput: '9' }, { input: '[]', expectedOutput: 'None' }] },
  { problem_id: '107', title: 'Count Vowels', description: 'Count vowels in input string.', difficulty: 'Easy', language: 'Python', expected_output: 'Integer', tags: ['strings'], test_cases: [{ input: '"hello"', expectedOutput: '2' }, { input: '"rhythm"', expectedOutput: '0' }] },
  { problem_id: '108', title: 'Reverse Words', description: 'Reverse order of words in sentence.', difficulty: 'Easy', language: 'Python', expected_output: 'String', tags: ['strings'], test_cases: [{ input: '"I love AI"', expectedOutput: '"AI love I"' }, { input: '"single"', expectedOutput: '"single"' }] },
  { problem_id: '109', title: 'Two Sum', description: 'Return indices of two numbers adding to target.', difficulty: 'Medium', language: 'Python', expected_output: 'Index pair', tags: ['arrays', 'hashmap'], test_cases: [{ input: 'nums=[2,7,11,15], target=9', expectedOutput: '[0,1]' }, { input: 'nums=[3,2,4], target=6', expectedOutput: '[1,2]' }] },
  { problem_id: '110', title: 'Valid Parentheses', description: 'Check if parentheses string is balanced.', difficulty: 'Medium', language: 'Python', expected_output: 'Boolean', tags: ['stack'], test_cases: [{ input: '"()[]{}"', expectedOutput: 'True' }, { input: '"([)]"', expectedOutput: 'False' }] },
  { problem_id: '111', title: 'Anagram Check', description: 'Check if two strings are anagrams.', difficulty: 'Medium', language: 'Python', expected_output: 'Boolean', tags: ['strings'], test_cases: [{ input: '"listen", "silent"', expectedOutput: 'True' }, { input: '"rat", "car"', expectedOutput: 'False' }] },
  { problem_id: '112', title: 'Merge Sorted Arrays', description: 'Merge two sorted arrays into one sorted array.', difficulty: 'Medium', language: 'Python', expected_output: 'Sorted array', tags: ['arrays', 'two-pointers'], test_cases: [{ input: '[1,3,5],[2,4,6]', expectedOutput: '[1,2,3,4,5,6]' }] },
  { problem_id: '113', title: 'Binary Search', description: 'Return index of target in sorted array else -1.', difficulty: 'Medium', language: 'Python', expected_output: 'Index', tags: ['search'], test_cases: [{ input: 'arr=[1,2,3,4,5], target=4', expectedOutput: '3' }, { input: 'arr=[1,2,3], target=9', expectedOutput: '-1' }] },
  { problem_id: '114', title: 'Longest Common Prefix', description: 'Find longest common prefix among strings.', difficulty: 'Medium', language: 'Python', expected_output: 'String', tags: ['strings'], test_cases: [{ input: '["flower","flow","flight"]', expectedOutput: '"fl"' }, { input: '["dog","racecar","car"]', expectedOutput: '""' }] },
  { problem_id: '115', title: 'Rotate Array', description: 'Rotate array right by k steps.', difficulty: 'Medium', language: 'Python', expected_output: 'Array', tags: ['arrays'], test_cases: [{ input: 'nums=[1,2,3,4,5], k=2', expectedOutput: '[4,5,1,2,3]' }] },
  { problem_id: '116', title: 'Unique Characters', description: 'Return True if all chars in string are unique.', difficulty: 'Medium', language: 'Python', expected_output: 'Boolean', tags: ['strings', 'set'], test_cases: [{ input: '"abc"', expectedOutput: 'True' }, { input: '"aabc"', expectedOutput: 'False' }] },
  { problem_id: '117', title: 'JSON Field Extractor', description: 'Extract name, email, phone, company from plain text as JSON.', difficulty: 'Hard', language: 'Python', expected_output: 'JSON', tags: ['parsing'], test_cases: [{ input: '"John from X, email a@b.com, phone 555"', expectedOutput: '{"name":"John"} (partial allowed)' }] },
  { problem_id: '118', title: 'LRU Cache Design', description: 'Implement LRU cache with O(1) get and put.', difficulty: 'Hard', language: 'Python', expected_output: 'Class behavior', tags: ['design', 'hashmap'], test_cases: [{ input: 'capacity=2; put/get sequence', expectedOutput: 'Matches LRU policy' }] },
  { problem_id: '119', title: 'Word Ladder Steps', description: 'Return shortest transformation length between words.', difficulty: 'Hard', language: 'Python', expected_output: 'Integer', tags: ['graph', 'bfs'], test_cases: [{ input: 'begin=hit,end=cog', expectedOutput: '5' }] },
  { problem_id: '120', title: 'Top K Frequent', description: 'Return k most frequent elements.', difficulty: 'Hard', language: 'Python', expected_output: 'Array', tags: ['heap', 'hashmap'], test_cases: [{ input: 'nums=[1,1,1,2,2,3], k=2', expectedOutput: '[1,2]' }] },
];
