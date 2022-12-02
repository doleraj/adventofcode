package y2017

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.File

class day21Test {

    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        return File(fileUri).readLines()
    }

    val mat = listOf(
            listOf('.', '#', '.'),
            listOf('.', '.', '#'),
            listOf('#', '#', '#')
        )

    @Test
    fun testRotateMatrix() {
        val rotated = listOf(
                listOf('.', '#', '#'),
                listOf('#', '.', '#'),
                listOf('.', '.', '#')
        )
        assertEquals(rotated, rotateMatrix(mat))
    }

    @Test
    fun testMirrorMatrix() {
        val mirrored = listOf(
                listOf('.', '#', '.'),
                listOf('#', '.', '.'),
                listOf('#', '#', '#')
        )
        assertEquals(mirrored, mirrorMatrix(mat))
    }

    @Test
    fun testWaterMatrix() {
        val watered = listOf(
                listOf('#', '#', '#'),
                listOf('.', '.', '#'),
                listOf('.', '#', '.')
        )
        assertEquals(watered, waterMatrix(mat))
    }

    @Test
    fun test1() {
        assertEquals(12, day21(2, parseFile("2017/day21TestInput.txt")))
    }

    @Test
    fun test1Actual() {
        assertEquals(176, day21(5, parseFile("2017/day21ActualInput.txt")))
    }

    @Test
    fun test2Actual() {
        assertEquals(2368161, day21(18, parseFile("2017/day21ActualInput.txt")))
    }
}
