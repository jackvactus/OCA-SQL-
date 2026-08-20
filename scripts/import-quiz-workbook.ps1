Add-Type -AssemblyName System.IO.Compression.FileSystem

$source = Join-Path $PSScriptRoot '..\docs\1Z0-071_COMPLETE_MASTER_EXAM_PREP_320_QUESTIONS_2026.docx'
$target = Join-Path $PSScriptRoot '..\lib\quiz-data-en-workbook.ts'
$zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $source))
try {
  $reader = New-Object System.IO.StreamReader($zip.GetEntry('word/document.xml').Open())
  try { $xml = [xml]$reader.ReadToEnd() } finally { $reader.Close() }
} finally { $zip.Dispose() }

$namespace = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$namespace.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$lines = @(
  foreach ($paragraph in $xml.SelectNodes('//w:body/w:p', $namespace)) {
    $text = (($paragraph.SelectNodes('.//w:t', $namespace) | ForEach-Object InnerText) -join '').Trim()
    if ($text) { $text }
  }
)
$mockStart = [Array]::IndexOf($lines, 'Final 78-Question Timed Mock')
if ($mockStart -ge 0) {
  $lines = $lines[0..($mockStart - 1)]
}

$headingPattern = '^\d+\. (?!Which |What |How |Why |When |Where |Suppose |Assume |Consider |Select |A |An |In |For |If |The |Using |Given |After |Before |During |Under )(.+)$'
$questions = [System.Collections.Generic.List[object]]::new()
$domainIndex = 0
$domain = 'General SQL'
$questionNumber = 0

for ($index = 0; $index -lt $lines.Count; $index++) {
  $line = $lines[$index]
  $headingMatch = [regex]::Match($line, $headingPattern)
  if ($headingMatch.Success -and ($index + 1 -ge $lines.Count -or $lines[$index + 1] -notmatch '^A\. ')) {
    $domainIndex += 1
    $domain = $headingMatch.Groups[1].Value
    continue
  }

  $questionMatch = [regex]::Match($line, '^\d+\. (.+)$')
  if (-not $questionMatch.Success -or $index + 6 -ge $lines.Count -or $lines[$index + 1] -notmatch '^A\. ') {
    continue
  }

  $questionText = $questionMatch.Groups[1].Value
  $options = @()
  for ($optionIndex = 1; $optionIndex -le 4; $optionIndex++) {
    $optionMatch = [regex]::Match($lines[$index + $optionIndex], '^[A-D]\. (.+)$')
    if (-not $optionMatch.Success) {
      throw "Invalid option near document line $index"
    }
    $options += $optionMatch.Groups[1].Value
  }

  $answerMatch = [regex]::Match($lines[$index + 5], '^Answer: ([A-D])$')
  if (-not $answerMatch.Success) {
    throw "Invalid answer near document line $index"
  }
  $answerLetter = $answerMatch.Groups[1].Value
  $answerIndex = [int][char]$answerLetter - [int][char]'A'

  $explanationMatch = [regex]::Match($lines[$index + 6], '^Explanation: (.+)$')
  if (-not $explanationMatch.Success) {
    throw "Invalid explanation near document line $index"
  }
  $explanation = $explanationMatch.Groups[1].Value
  $questionNumber += 1
  $difficulty = if ($questionText -match 'Which two|Which three|output|scenario|valid|invalid|correlated|analytic|time zone|metadata|regular expression') { 'hard' } elseif ($questionText -match 'Which statement|What does|Which command|Which function|Which object') { 'easy' } else { 'medium' }
  $questions.Add([ordered]@{
      id = "workbook-q$questionNumber"
      moduleId = "m$([Math]::Min([Math]::Max($domainIndex, 1), 18))"
      question = $questionText
      options = $options
      correctIndexes = @($answerIndex)
      explanation = $explanation
      topic = $domain
      difficulty = $difficulty
    })
}

if ($questions.Count -ne 320) {
  throw "Expected 320 questions, found $($questions.Count)"
}

$json = $questions | ConvertTo-Json -Depth 6
$content = @"
import type { QuizQuestion } from './types';

/**
 * 320 original English practice questions imported from the preparation workbook.
 * The workbook is an original training source, not a live-exam question dump.
 */
export const workbookQuizQuestions: QuizQuestion[] = $json;
"@
[System.IO.File]::WriteAllText((Resolve-Path (Join-Path $PSScriptRoot '..\lib')).Path + '\quiz-data-en-workbook.ts', $content, [System.Text.UTF8Encoding]::new($false))
Write-Output "Imported $($questions.Count) questions across $domainIndex domains into lib/quiz-data-en-workbook.ts"
