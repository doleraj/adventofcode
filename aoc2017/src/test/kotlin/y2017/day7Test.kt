package y2017

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.File

class day7Test {
    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0, {""})
        File(fileUri).forEachLine { line -> lines.add(line)  }
        return lines.toTypedArray()
    }

    @Test
    fun test1() {
        assertEquals("tknk", day7(parseFile("2017/day7TestInput.txt")).name)
    }

    @Test
    fun testActual() {
        assertEquals("uownj", day7(parseFile("2017/day7ActualInput.txt")).name)
    }

    @Test
    fun test1Second() {
        assertEquals(60, findUnbalancedChild(parseFile("2017/day7TestInput.txt")).second)
    }

    @Test
    fun testActualSecond() {
        assertEquals(596, findUnbalancedChild(parseFile("2017/day7ActualInput.txt")).second)
    }
}
