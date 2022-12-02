package y2018

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.io.File

class day7Test {
    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0) {""}
        File(fileUri).forEachLine { line -> lines.add(line)  }
        return lines.toTypedArray()
    }

    @Test
    fun test1() {
        assertEquals("CABDFE", day7(parseFile("y2018/day07TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals("EPWCFXKISTZVJHDGNABLQYMORU", day7(parseFile("y2018/day07ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(15, day7Second(2, 0, parseFile("y2018/day07TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(952, day7Second(5, 60, parseFile("y2018/day07ActualInput.txt")))
    }
}
