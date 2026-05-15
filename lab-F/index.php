<?php
require_once __DIR__ . '/autoload.php';

$inputType = $_POST['inputType'] ?? '';
setcookie('inputType', $inputType, time() + 3600);

$inputText = $_POST['inputText'] ?? '';
setcookie('inputText', $inputText, time() + 3600);

$outputType = $_POST['outputType'] ?? '';
setcookie('outputType', $outputType, time() + 3600);

$outputText = '';
setcookie('outputText', $outputText, time() + 3600);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bartosz Stryjewski (57794) - PTW LAB F</title>
    <link rel="stylesheet" href="styles.css" type="text/css">
</head>
<body>
<main class="page-shell">
    <form class="converter-form" action="" method="POST">
        <section class="panel panel-left">
            <h1>Input</h1>

            <label for="inputType">Select the input type</label>
            <select name="inputType" id="inputType">
                <option value="csv" <?php echo $inputType === 'csv' ? 'selected' : ''; ?>>CSV</option>
                <option value="ssv" <?php echo $inputType === 'ssv' ? 'selected' : ''; ?>>SSV</option>
                <option value="tsv" <?php echo $inputType === 'tsv' ? 'selected' : ''; ?>>TSV</option>
                <option value="json" <?php echo $inputType === 'json' ? 'selected' : ''; ?>>JSON</option>
                <option value="yaml" <?php echo $inputType === 'yaml' ? 'selected' : ''; ?>>YAML</option>
            </select>

            <label for="inputText">Input text</label>
            <textarea id="inputText" name="inputText" placeholder="Paste your data here..."><?php echo htmlspecialchars($inputText); ?></textarea>

            <input class="submit-btn" type="submit" value="Convert">
        </section>

        <section class="panel panel-right">
            <h1>Output</h1>

            <label for="outputType">Select the output type</label>
            <select name="outputType" id="outputType">
                <option value="csv" <?php echo $outputType === 'csv' ? 'selected' : ''; ?>>CSV</option>
                <option value="ssv" <?php echo $outputType === 'ssv' ? 'selected' : ''; ?>>SSV</option>
                <option value="tsv" <?php echo $outputType === 'tsv' ? 'selected' : ''; ?>>TSV</option>
                <option value="json" <?php echo $outputType === 'json' ? 'selected' : ''; ?>>JSON</option>
                <option value="yaml" <?php echo $outputType === 'yaml' ? 'selected' : ''; ?>>YAML</option>
            </select>

            <label for="outputText">Output text</label>
            <textarea id="outputText" name="outputText" readonly placeholder="Your converted data will appear here..."><?php echo htmlspecialchars($outputText); ?></textarea>
        </section>
    </form>
</main>
</body>
</html>
