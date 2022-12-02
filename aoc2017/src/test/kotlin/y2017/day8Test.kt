package y2017

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.File

class day8Test {
    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0, { "" })
        File(fileUri).forEachLine { line -> lines.add(line) }
        return lines.toTypedArray()
    }

    @Test
    fun test1() {
        assertEquals(1, day8(parseFile("2017/day8TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(3089, day8(parseFile("2017/day8ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(10, day8Second(parseFile("2017/day8TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(5391, day8Second(parseFile("2017/day8ActualInput.txt")))
    }
}
