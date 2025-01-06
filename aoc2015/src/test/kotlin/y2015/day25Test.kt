package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day25Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(21629792, day25("To continue, please consult the code grid in the manual.  Enter the code at row 2, column 2."))
    }

    @Test
    fun test2() {
        assertEquals(27995004, day25("To continue, please consult the code grid in the manual.  Enter the code at row 6, column 6."))
    }

    @Test
    fun testActual() {
        assertEquals(19980801, day25(parseFile("y2015/day25ActualInput.txt").joinToString("\n")))
    }
}

