<?php
require_once __DIR__ . '/autoload.php';

$inputType = $_POST['inputType'] ?? $_COOKIE['inputType'] ?? 'csv';
$inputText = $_POST['inputText'] ?? $_COOKIE['inputText'] ?? '';
$outputType = $_POST['outputType'] ?? $_COOKIE['outputType'] ?? 'csv';
$outputText = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['convertTask'])) {
    setcookie('inputType', $inputType, time() + 3600);
    setcookie('inputText', $inputText, time() + 3600);
    setcookie('outputType', $outputType, time() + 3600);

    if (trim($inputText) !== '') {
        try {
            $serializer = new Serializer();
            $outputText = $serializer->convert($inputText, $inputType, $outputType);
        } catch (Throwable $e) {
            $outputText = 'Error: ' . $e->getMessage();
        }
        setcookie('outputText', $outputText, time() + 3600);
    } else {
        setcookie('outputText', '', time() + 3600);
    }
} else {
    $outputText = $_COOKIE['outputText'] ?? '';
}
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

            <input class="submit-btn" name="convertTask" type="submit" value="Convert">
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
            <pre id="outputText"><?php echo $outputText; ?></pre>
        </section>
    </form>
</main>
</body>
</html>
